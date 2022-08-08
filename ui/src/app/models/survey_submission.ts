import { Answer } from './answer';
import { User } from './user';

export class SurveySubmission {
    /// The id of the submission
    id: string | null;
    /// The date and time when the survey was submitted.
    date: Date;
    /// The id of the survey that this submission belongs to.
    surveyId: string;
    /// The id of the user who answered the question.
    /// This value is `null` for anonymous users.
    user: User | string | null;
    /// The respondent id of the user who answered the question. The id
    /// is the same for all answers in a survey made by the same user, 
    /// but may differ among surveys.This value is always present.
    respondentId: string;
    /// The submission's answers.
    answers: (Answer | string)[];

    constructor(opts: { id: string | null, surveyId: string, user: string | null, respondentId?: string, answers: Answer[] }) {
        this.id = opts.id;
        this.surveyId = opts.surveyId;
        this.user = opts.user;
        this.respondentId = opts.respondentId;
        this.answers = opts.answers;
    }
}