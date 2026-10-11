import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  analyze,
  listAnalyses,
  getAnalysis,
} from "../controller/analysisController.js";
import { asyncHandler } from "../utils.js";

const router = Router();

router.get("/health", (req, res) => res.json({ ok: true, uptime: process.uptime() }));
router.get("/analyses", asyncHandler(listAnalyses));
router.get("/analyses/:id", asyncHandler(getAnalysis));
router.post("/analyze", upload.single("resume"), asyncHandler(analyze));

export default router;

