//question interface
import * as mongoose from "mongoose";
import ISurvey from "./ISurvey";

export type ControlType = "text-input" | "choice" | "datepicker";

export interface IQuestion extends mongoose.Document {
  id: string;
  survey: ISurvey | string;
  defaultValue?: string;
  prompt: string;
  dataName: string;
  required: boolean;
  controlType: ControlType;
  inputType?: string;
  payload: { key: string; value: string }[];
}

export default IQuestion;
