import mongoose from "mongoose";

const { Schema } = mongoose;

const AnalysisSchema = new Schema(
  {
    resumeFileName: { type: String, default: "" },
    resumeBytes: { type: Number, default: 0 },
    resumePages: { type: Number, default: 0 },
    // We store extracted text (trimmed) rather than the binary PDF for now.
    resumeText: { type: String, default: "" },
    jobDescription: { type: String, default: "" },
    score: { type: Number, required: true },
    present: [{ type: String }],
    missing: [{ type: String }],
    jdSkills: [{ type: String }],
    matchedKeywords: [{ type: String }],
    summary: { type: String, default: "" },
  },
  { timestamps: true }
);

// Keep documents from growing unbounded: cap the stored resume text.
AnalysisSchema.pre("save", function (next) {
  if (this.resumeText && this.resumeText.length > 20000) {
    this.resumeText = this.resumeText.slice(0, 20000);
  }
  next();
});

export const Analysis = mongoose.model("Analysis", AnalysisSchema);
export default Analysis;
