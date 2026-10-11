import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

export function createApp() {
  const app = express();

  // Allow the Vite dev server (and any origins in CORS_ORIGIN) to call the API.
  const allowed = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        // Allow same-origin/curl (no origin) and anything explicitly allowed.
        if (!origin || allowed.includes(origin)) return callback(null, true);
        return callback(new Error(`Origin not allowed by CORS: ${origin}`));
      },
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.get("/", (req, res) => {
    res.json({
      name: "0 to Shipped — Resume Parser API",
      status: "ok",
      endpoints: ["/api/health", "/api/analyze", "/api/analyses"],
    });
  });

  app.use("/api", routes);

  // Multer / CORS / route errors land here.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || (err.name === "MulterError" ? 400 : 500);
    const message =
      err.name === "MulterError"
        ? err.code === "LIMIT_FILE_SIZE"
          ? "That file is larger than 10 MB. Please try a smaller PDF."
          : err.message
        : err.message || "Server error";

    // Only log unexpected server errors; 4xx are expected client mistakes.
    if (status >= 500) console.error("[error]", err);
    else console.warn(`[client ${status}]`, err.message);

    res.status(status).json({ error: message });
  });

  return app;
}
