import {
  Request,
  Response,
  Router
} from "express";
import {
  StatusCodes,
} from "http-status-codes";
import {
  v4 as uuidv4
} from "uuid";
import {
  assert
} from "console";

import {
  ensureRequestAuth,
  extractUserIdFromJWT
} from "../shared/AuthGateway";
import {
  IAnswer,
  IQuestion,
  ISurvey,
  IUser,
  SurveySubmission
} from "../models/index";
const {
  NOT_FOUND,
  NO_CONTENT,
  BAD_REQUEST,
  CREATED,
  UNAUTHORIZED,
  OK,
} = StatusCodes;

// Requires are needed to initialize the models
const _Question = require("../models/Question");
const _Answer = require("../models/Answer");
const _Survey = require("../models/Survey");

import Question, {
  makeQuestion,
  updateQuestionFields,
} from "../models/Question";
import Answer from "../models/Answer";
import Survey from "../models/Survey";
import User from "../models/User";
import {
  QueryPopulateOptions
} from "mongoose";

const router = Router();

/// Create a new Survey -- POST /api/surveys/create
router.post("/create", ensureRequestAuth, async (req, res, next) => {
  const data: ISurvey = req.body;

  // TODO: get the id from the request object after #33 is implemented instead of this
  if (!data.creator) {
    return res.status(BAD_REQUEST).json({
      error: "Missing the creator ID"
    });
  }

  const creator = await User.findById(data.creator).exec();
  if (!creator) {
    return res.status(BAD_REQUEST).json({
      error: `User with ID \`${data.creator}\` doesn't exist.`,
    });
  }

  let survey = new Survey({
    title: data.title,
    creator: creator,
    createdDate: data.createdDate,
    endDate: data.endDate,
    questions: [],
  });
  await survey.save();

  const questions = [];
  for (const question of data.questions) {
    const q: IQuestion = < IQuestion > question;
    questions.push(makeQuestion(q, survey.id));
  }
  await Question.create(questions);

  survey.questions.push(...questions);
  await survey.save();

  return res.status(CREATED).json(survey.toJSON());
});

/// Update a survey -- /api/surveys/update
router.put("/update", ensureRequestAuth, async (req, res) => {
  // TODO: check that the user owns the survey they're trying to update/delete.

  const data: ISurvey = req.body;
  const survey = await Survey.findById(data.id).exec();
  if (survey == null) {
    return res
      .status(BAD_REQUEST)
      .json({
        error: `Survey with id \`${data.id}\``
      });
  }

  if (survey.creator != req.userId) {
    return res.status(UNAUTHORIZED).json({
      error: `You do not have the permission to edit this survey.`
    })
  }

  const existingQuestions = (
    await Question.find({
      survey: data.id
    }).exec()
  ).reduce((map: any, q: string | IQuestion) => {
    if (typeof q === "string") {
      // satisfy typescript
      assert(typeof q !== "string");
      return;
    }
    map[ < string > q.dataName] = q;
    return map;
  }, {});

  for (const q of data.questions) {
    if (typeof q === "string") {
      throw new Error("Missing question body in an /update request");
    }
    if (existingQuestions[q.dataName] != undefined) {
      updateQuestionFields(existingQuestions[q.dataName], q);
    } else {
      existingQuestions[q.dataName] = makeQuestion(q, survey.id);
    }
  }

  // TODO: perform data checks here?
  // TODO: e.g. make sure that all dataNames are unique

  // Update/create the questions in bulk
  const newQuestions: IQuestion[] = Object.values(existingQuestions);
  await Question.bulkWrite(
    newQuestions.map((q) => {
      return {
        updateOne: {
          filter: {
            _id: q.id
          },
          update: q.toObject(),
          upsert: true,
        },
      };
    })
  );

  // Then update the survey
  survey.title = data.title || survey.title;
  survey.endDate = data.endDate || survey.endDate;
  survey.questions = newQuestions;
  await survey.save();

  return res.status(OK).json(survey.toJSON());
});

/// Retrieve all active surveys
router.get("/list", async (req, res) => {
  // TODO: set a reasonable limit for the number of returned surveys
  const filter = req.query.inactive === '1' ? {} : {
    $or: [{ endDate: undefined }, { endDate: { $gte: new Date(Date.now()) } }],
  };
  const surveys = await Survey.find(filter)
    .populate(["questions", "creator"])
    .exec();
  return res.status(OK).json({ data: surveys.map((s: ISurvey) => s.toJSON()) });
});

/// Retrieve a survey by its id -- /api/surveys/by/id/:id
router.get("/by/id/:id", async (req, res) => {
  const {
    id
  } = req.params;

  const populateWith: QueryPopulateOptions[] = [{
    path: "questions"
  }, {
    path: "creator"
  }];

  const includeSubmissions = req.query.includeSubmissions &&
    req.query.includeSubmissions === 'true';

  if (includeSubmissions) {
    populateWith.push({
      path: 'submissions',
      populate: [{
          path: "user"
        },
        {
          path: "answers"
        }
      ]
    });
  }

  const survey = await Survey.findById(id)
    .populate(populateWith)
    .exec();


  if (survey == null) {
    return res.status(NOT_FOUND).json({
      error: `Survey with id \`${id}\` doesn't exist.`,
    });
  }

  const json = survey.toJSON();
  if (!includeSubmissions) {
    delete json.submissions;
  }

  return res.status(OK).json(json);
});

/// Retrieve all surveys by user id -- /api/surveys/by/user/:id
router.get("/by/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(NOT_FOUND).json({
      error: `User not found.`,
    });
  }
  const surveys = await Survey.find({
      creator: id
    })
    .populate("questions")
    .exec();
  return res.status(OK).json({
    data: surveys.map((s: ISurvey) => s.toJSON())
  });
});

/// Delete a Survey  -- DELETE /api/surveys/delete/:id
router.delete("/delete/:id", ensureRequestAuth, async (req, res) => {
  const {
    id
  } = req.params;
  const survey = await Survey.findOne({
    _id: id
  }).exec();

  if (!survey) {
    return res.status(NO_CONTENT).end();
  }

  if (survey.creator != req.userId) {
    return res.status(UNAUTHORIZED).json({
      error: `You do not have the permission to delete this survey.`
    })
  }

  return res.status(OK).end();
});

/// Submit a Survey  -- POST /api/surveys/submit/:id
router.post("/submit/:id", extractUserIdFromJWT, async (req, res) => {
  const {
    id
  } = req.params;
  const data: {
    answers: IAnswer[]
  } = req.body;

  const survey = await Survey.findById(id).exec();
  if (!survey) {
    return res.status(NOT_FOUND).json({
      error: `Survey with id \`${id}\` doesn't exist.`,
    });
  }

  const user = req.userId ? await User.findById(req.userId).exec() : null;
  const respondentId = uuidv4();

  const answers = data.answers.map(a => new Answer({
    question: a.question,
    answer: a.answer,
  }));
  await Answer.create(answers);

  const submission = new SurveySubmission({
    surveyId: survey,
    user: user,
    respondentId: respondentId,
    answers: answers,
  })

  await submission.save();

  survey.submissions.push(submission);
  await survey.save();

  return res.status(OK).json({});
});

export default router;