import * as mongoose from "mongoose";
import IQuestion from "./IQuestion";

export type ControlType = "text-input" | "choice";

export const QuestionSchema = new mongoose.Schema({
  survey: { type: mongoose.Schema.Types.ObjectId, required: true },
  defaultValue: { type: String, required: false },
  prompt: { type: String, required: true },
  dataName: { type: String, required: true },
  required: { type: Boolean, required: true },
  controlType: String,
  inputType: { type: String, required: false, default: "text" },
  payload: { type: [{ key: String, value: String }], required: true, default: [] },
});

QuestionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    ret.id = ret._id;
  }
});

export function makeQuestion(q: IQuestion, customSurveyId?: string): IQuestion {
  return new Question({
    survey: customSurveyId || q.survey,
    defaultValue: q.defaultValue,
    prompt: q.prompt,
    dataName: q.dataName,
    required: q.required,
    controlType: q.controlType,
    inputType: q.inputType,
    payload: q.payload,
  });
}

export function updateQuestionFields(qDest: IQuestion, qSource: IQuestion): IQuestion {
  qDest.defaultValue = qSource.defaultValue || qDest.defaultValue;
  qDest.prompt = qSource.prompt || qDest.prompt;
  qDest.dataName = qSource.dataName || qDest.dataName;
  qDest.required = qSource.required || qDest.required;
  qDest.controlType = qSource.controlType || qDest.controlType;
  qDest.inputType = qSource.inputType || qDest.inputType;
  qDest.payload = qSource.payload || qDest.payload;
  return qDest;
}

const Question = mongoose.model<IQuestion>("Question", QuestionSchema);
export default Question;
