import multer from "multer";
import { MAX_PDF_BYTES } from "../service/constants.js";

// In-memory storage: we parse the PDF immediately and never write to disk.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const isPdf =
    file.mimetype === "application/pdf" ||
    (file.originalname || "").toLowerCase().endsWith(".pdf");
  if (isPdf) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_PDF_BYTES,
    files: 1,
  },
});
