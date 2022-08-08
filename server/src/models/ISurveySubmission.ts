import * as mongoose from "mongoose";
import { IAnswer } from ".";
import IUser from "./IUser";

export interface ISurveySubmission extends mongoose.Document {
    id: string;
    date: Date;
    surveyId: string;
    user: IUser | string | null;
    respondentId: string;
    answers: [IAnswer | string];
}

export default ISurveySubmission;
