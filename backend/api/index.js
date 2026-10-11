import { createApp } from "../app.js";
import { connectDB } from "../config/db.js";

/**
 * Vercel serverless entry point.
 *
 * Unlike server.js (used for local dev, which calls app.listen()), Vercel
 * expects a module that exports a request handler. Any file under /api is
 * treated as a serverless function, and vercel.json routes all traffic here.
 *
 * We ensure the (cached) MongoDB connection is ready before delegating to
 * the Express app.
 */
const app = createApp();

export default async function handler(req, res) {
  try {
    await connectDB(process.env.MONGODB_URI);
  } catch (err) {
    console.error("[api] Database connection failed:", err.message);
    return res
      .status(500)
      .json({ error: "Database connection failed. Please try again later." });
  }

  // Express apps are themselves (req, res) handlers.
  return app(req, res);
}
