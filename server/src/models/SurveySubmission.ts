import * as mongoose from "mongoose";
import ISurveySubmission from "./ISurveySubmission";

export const SurveySubmissionSchema = new mongoose.Schema({
    surveyId: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    respondentId: { type: String, required: true },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true }],
});

SurveySubmissionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (_doc, ret) {
        ret.id = ret._id;
    }
});

const SurveySubmission = mongoose.model<ISurveySubmission>("SurveySubmission", SurveySubmissionSchema);
export default SurveySubmission;

