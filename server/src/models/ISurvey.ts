//survey interface
import * as mongoose from "mongoose";
import IQuestion from "./IQuestion";
import ISurveySubmission from "./ISurveySubmission"
import IUser from "./IUser";

export interface ISurvey extends mongoose.Document {
  id: string;
  creator: IUser | string;
  title: string;
  createdDate: Date;
  endDate?: Date;
  questions: (IQuestion | string)[];
  submissions: (ISurveySubmission | string)[];
}

export default ISurvey;
