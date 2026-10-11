// Thin wrapper around the backend API.
// In dev, Vite proxies "/api" to the Express server (see vite.config.js),
// so we can call relative URLs without worrying about CORS or ports.

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/**
 * Send a resume PDF + job description to the backend for comparison.
 * @param {{ file: File, jobDescription: string }} input
 * @returns {Promise<AnalysisResult>}
 */
export async function analyzeResume({ file, jobDescription }) {
  const form = new FormData();
  form.append("resume", file);
  form.append("jobDescription", jobDescription);

  let res;
  try {
    res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      body: form,
    });
  } catch (networkErr) {
    throw new Error(
      "Could not reach the server. Is the backend running on port 5000?"
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status}).`);
  }

  return data;
}
