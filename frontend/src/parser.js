/* ============================================================
   0 to Shipped — Resume Parser
   Client-side helpers.
   ------------------------------------------------------------
   The actual analysis now happens on the backend (Express +
   MongoDB). Here we keep only file validation and the small
   presentation helpers used to label the score.
   ============================================================ */

export const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

// Validate an uploaded file. Returns an error string, or null when valid.
export function validateFile(file) {
  if (!file) return "Please choose a file to upload.";
  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "Please upload a valid PDF file.";
  if (file.size > MAX_BYTES) {
    return "That file is larger than 10 MB. Please try a smaller PDF.";
  }
  return null;
}

// Minimum characters for a job description to be considered meaningful.
export const MIN_JD_CHARS = 40;

export function validateJd(text) {
  const t = (text || "").trim();
  if (t.length < MIN_JD_CHARS) {
    return "Please paste the full job description (at least 40 characters).";
  }
  return null;
}

export function ratingFor(score) {
  if (score >= 80) return { cls: "rating-strong", label: "Strong match" };
  if (score >= 60) return { cls: "rating-average", label: "Solid, improvable" };
  return { cls: "rating-weak", label: "Needs work" };
}

export function headlineFor(score) {
  if (score >= 80) return "Great match — you're in demand!";
  if (score >= 60) return "Decent match with room to grow.";
  return "Let's tailor your resume for this role.";
}

export function summaryFor(result) {
  if (result && typeof result.summary === "string" && result.summary) {
    return result.summary;
  }
  const p = result?.present?.length ?? 0;
  const m = result?.missing?.length ?? 0;
  return (
    `We found ${p} matching skill${p === 1 ? "" : "s"} and spotted ` +
    `${m} gap${m === 1 ? "" : "s"} to close. ` +
    "Add the missing skills below to boost your score."
  );
}
