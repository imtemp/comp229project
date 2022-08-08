//survey model
import * as mongoose from "mongoose";
import ISurvey from "./ISurvey";

export const SurveySchema = new mongoose.Schema({
  title: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    required: true,
  },
  submissions: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "SurveySubmission" }],
    required: false,
    default: [],
  },
  createdDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: false },
});

SurveySchema.pre("remove", function (callback) {
  this.model("questions").remove({ Question_survey: this._id }, callback);
});

SurveySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    ret.creator = { username: ret.creator?.username, id: ret.creator?._id };
    ret.id = ret._id;
  },
});

const Survey = mongoose.model<ISurvey>("Survey", SurveySchema);
export default Survey;
