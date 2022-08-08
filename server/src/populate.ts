/**
 * Clears the database adn pre-populates it with surveys.
 */
import mongoose = require("mongoose");
import {
    v4 as uuidv4
  } from "uuid";

import {
    DB_URI
} from "./shared/constants";

import {
    User,
    Question,
    Answer,
    Survey,
    ISurvey,
    IUser,
    IQuestion,
    SurveySubmission,
} from "./models";
import {
    hashPwd
} from "./models/User";

const N_SURVEYS = 10;
const P_ACTIVE = 0.5;
const P_DATE = 0.4;
const DEFAULT_USER = {
    username: "test",
    email: "test@test",
    password: "testtest",
    pwdHash: hashPwd("testtest"),
};

// Database setup
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", async () => {
    console.log("Connected to MongoDB...");
    await main();
    process.exit(0);
});

async function clearDB() {
    console.log(`Removed ${(await User.deleteMany({}).exec()).deletedCount} user(s).`);
    console.log(`Removed ${(await Survey.deleteMany({}).exec()).deletedCount} survey(s).`);
    console.log(`Removed ${(await Question.deleteMany({}).exec()).deletedCount} question(s).`);
    console.log(`Removed ${(await Answer.deleteMany({}).exec()).deletedCount} answer(s).`);
}

async function generateQuestions(survey: ISurvey): Promise < IQuestion[] > {
    const questions = [];

    questions.push(
        new Question({
            survey: survey,
            prompt: "Answer question #1: ",
            dataName: "question-#1",
            required: true,
            controlType: "choice",
            inputType: null,
            payload: [{
                    "key": "config-multiple",
                    "value": "false"
                },
                {
                    "key": "choice-1",
                    "value": "A"
                },
                {
                    "key": "choice-2",
                    "value": "B"
                },
                {
                    "key": "choice-3",
                    "value": "C"
                },
            ],
        }),
        new Question({
            survey: survey,
            prompt: "Answer question #2: ",
            dataName: "question-#2",
            required: false,
            controlType: "choice",
            inputType: null,
            payload: [{
                    "key": "choice-0",
                    "value": "A"
                },
                {
                    "key": "choice-1",
                    "value": "B"
                },
                {
                    "key": "choice-2",
                    "value": "C"
                },
                {
                    "key": "choice-3",
                    "value": "D"
                },
                {
                    "key": "config-multiple",
                    "value": "true"
                }
            ],
        }),
        new Question({
            survey: survey,
            prompt: "Answer question #3: ",
            dataName: "question-#3",
            required: true,
            controlType: "datepicker",
            inputType: null,
            payload: []
        }),
        new Question({
            survey: survey,
            prompt: "Answer question #4: ",
            dataName: "question-#4",
            required: true,
            controlType: "text-input",
            inputType: "text",
            payload: []
        })
    );

    await Question.create(...questions);
    return questions;
}

async function generateSurvey(i: number, user: IUser): Promise < ISurvey > {
    let endDate: Date | null = null;

    // Randomly decide whether the survey should have an ending date.
    if (Math.random() < P_DATE) {
        endDate = new Date(Date.now());

        // Possibly an optimization or VM bug, the date ends up being in the August of 2019 if we remove the call to antiICE.
        function antiICE(x: any): any {
            return x;
        };
        endDate.setMonth(endDate.getMonth() + antiICE(Math.random() < P_ACTIVE ? 5 : -5));
    }

    const survey = new Survey({
        title: `Survey-${i}`,
        creator: user,
        questions: [],
        endDate: endDate,
    });
    await survey.save();

    survey.questions = await generateQuestions(survey);
    await survey.save();

    return survey;
}

function randomString(min: number, max: number) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let length = min + Math.random() * (max - min);
    for (var i = 0; i < length; ++i) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return result;
}

function randomChoice(set: string[], maxChoices: number | null = null): string[] {
    set = set.slice();
    const choices = [];
    const nChoices = Math.min(
        Math.max(1, set.length * Math.random()), 
        maxChoices || set.length
    );
    for (let i = 0; i < nChoices; ++i) {
        const at = set.length * Math.random() | 0;
        const choice = set.splice(at, 1)[0];
        choices.push(choice)
    }
    return choices;
}

async function generateResponses(survey: ISurvey, nSubmissions: number = 100) {
    const submissions = [];
    const allAnswers = [];

    for (let i = 0; i < nSubmissions; ++i) {
        const answers = [];
        for (const q of < IQuestion[] > survey.questions) {
            if (q.controlType === 'text-input') {
                answers.push(new Answer({
                    question: q._id,
                    answer: [randomString(1, 50)]
                }))
            } else if (q.controlType === 'choice') {
                answers.push(new Answer({
                    question: q._id, 
                    answer: randomChoice(
                        q.payload
                         .filter((kv: {key: string }) => kv.key.startsWith("choice"))
                         .map((kv: { key: string }) => kv.key))
                }));
            } else if (q.controlType === 'datepicker') {
                answers.push(new Answer({
                    question: q._id, 
                    answer: randomChoice([
                        "2020-01-30T14:51:02.445Z",
                        "2020-02-14T14:51:02.445Z",
                        "2020-03-21T14:51:02.445Z",
                        "2020-04-04T14:51:02.445Z",
                        "2020-05-09T14:51:02.445Z",
                        "2020-06-12T14:51:02.445Z",
                    ], 1)
                }));
            } else {
                throw new Error("Unknown control type: " + q.controlType);
            }
        }

        submissions.push(new SurveySubmission({
            surveyId: survey,
            user: null,
            respondentId: uuidv4(),
            answers: answers,
        }));
        allAnswers.push(...answers);
    }

    await Answer.create(allAnswers);
    await SurveySubmission.create(submissions);

    survey.submissions = submissions;
    await survey.save();

    console.log(`Generated ${nSubmissions} survey submissions.`);
}

async function populateDB(nSurveys: number) {
    const user = new User(DEFAULT_USER);
    await user.save();
    console.log(`Created the test user.`);

    const surveys: ISurvey[] = [];
    for (let i = 0; i < nSurveys; ++i) {
        surveys.push(await generateSurvey(i, user));
    }

    // Add a survey ending the next day
    const last = await generateSurvey(nSurveys, user);
    last.endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    await last.save();
    await generateResponses(last);

    surveys.push(last);

    console.log(`Created ${surveys.length} surveys.`);
}

async function main() {
    await clearDB();
    await populateDB(N_SURVEYS);
}