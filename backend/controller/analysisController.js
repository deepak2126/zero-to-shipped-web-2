import Analysis from "../models/Analysis.js";
import { compareResumeToJd } from "../service/compare.js";
import { extractPdfText } from "../service/pdf.js";
import { MAX_JD_CHARS, MIN_JD_CHARS } from "../service/constants.js";
import { httpError, isValidObjectId } from "../utils.js";

/**
 * POST /api/analyze
 * multipart/form-data:
 *   - resume: PDF file
 *   - jobDescription: text
 *
 * Errors are thrown as `httpError(...)` and caught by `asyncHandler`
 * in the router, then rendered by the error middleware in app.js.
 */
export async function analyze(req, res) {
  const jobDescription = (req.body.jobDescription || "").trim();

  if (!req.file) {
    throw httpError(400, "Please upload a resume PDF.");
  }
  if (jobDescription.length < MIN_JD_CHARS) {
    throw httpError(
      400,
      `Please paste a job description (at least ${MIN_JD_CHARS} characters).`
    );
  }
  if (jobDescription.length > MAX_JD_CHARS) {
    throw httpError(
      400,
      `Job description is too long (max ${MAX_JD_CHARS} characters).`
    );
  }

  // 1) Extract text from the PDF.
  let extracted;
  try {
    extracted = await extractPdfText(req.file.buffer);
  } catch (err) {
    console.error("[analyze] PDF parse failed:", err.message);
    throw httpError(422, "Could not read that PDF. Please try another file.");
  }

  if (!extracted.text) {
    throw httpError(
      422,
      "No selectable text found in the PDF (it may be scanned). Please upload a text-based resume."
    );
  }

  // 2) Compare resume vs JD (deterministic today, AI later).
  const result = compareResumeToJd({
    resumeText: extracted.text,
    jobDescription,
  });

  // 3) Persist.
  const doc = await Analysis.create({
    resumeFileName: req.file.originalname || "resume.pdf",
    resumeBytes: req.file.size || 0,
    resumePages: extracted.pages,
    resumeText: extracted.text,
    jobDescription,
    score: result.score,
    present: result.present,
    missing: result.missing,
    jdSkills: result.jdSkills,
    matchedKeywords: result.matchedKeywords,
    summary: result.summary,
  });

  return res.status(201).json({
    id: doc._id,
    createdAt: doc.createdAt,
    ...result,
  });
}

/** GET /api/analyses?limit=20 — most recent analyses. */
export async function listAnalyses(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const items = await Analysis.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("-resumeText -jobDescription");
  return res.json({ items });
}

/** GET /api/analyses/:id — a single analysis. */
export async function getAnalysis(req, res) {
  if (!isValidObjectId(req.params.id)) {
    throw httpError(404, "Analysis not found.");
  }
  const doc = await Analysis.findById(req.params.id);
  if (!doc) throw httpError(404, "Analysis not found.");
  return res.json({
    id: doc._id,
    createdAt: doc.createdAt,
    resumeFileName: doc.resumeFileName,
    resumePages: doc.resumePages,
    score: doc.score,
    present: doc.present,
    missing: doc.missing,
    jdSkills: doc.jdSkills,
    matchedKeywords: doc.matchedKeywords,
    summary: doc.summary,
  });
}

