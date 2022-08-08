import * as mongoose from "mongoose";
import IQuestion from "./IQuestion";

export interface IAnswer extends mongoose.Document {
  id: string,
  question: IQuestion | string,
  answer: [string];
}

export default IAnswer;
