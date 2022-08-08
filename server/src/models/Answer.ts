import * as mongoose from "mongoose";
import IAnswer from "./IAnswer";

export const AnswerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  answer: [String],
});

AnswerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    ret.id = ret._id;
  }
});

const Answer = mongoose.model<IAnswer>("Answer", AnswerSchema);
export default Answer;
