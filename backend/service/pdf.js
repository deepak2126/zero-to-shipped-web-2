import pdf from "pdf-parse";

/**
 * Extract plain text from an in-memory PDF buffer.
 * @param {Buffer} buffer
 * @returns {Promise<{text: string, pages: number}>}
 */
export async function extractPdfText(buffer) {
  const data = await pdf(buffer);
  return {
    text: (data.text || "").replace(/\s+\n/g, "\n").trim(),
    pages: data.numpages || 0,
  };
}
