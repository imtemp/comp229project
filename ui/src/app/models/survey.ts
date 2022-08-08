import { Question } from './question';
import { SurveySubmission } from './survey_submission';
import { User } from './user';

/// An existing survey
export class Survey {
    /// The id of the survey.
    id: string | null;
    /// The id of the user who created the survey.
    creator: User | string;
    /// The title of the survey.
    title: string;
    /// The date when the survey was crated.
    createdDate: Date;
    /// The date when the survey expires.
    endDate?: Date;
    /// The survey's questions.
    questions: Question[];
    /// The survey's answers.
    submissions: SurveySubmission[];

    constructor(opts: { id: string, creator: User | string, title: string, createdDate: Date, endDate?: Date, questions: Question[] }) {
        this.id = opts.id;
        this.creator = opts.creator;
        this.title = opts.title;
        this.createdDate = opts.createdDate;
        this.endDate = opts.endDate;
        this.questions = opts.questions;
        this.submissions = [];
    }
}
