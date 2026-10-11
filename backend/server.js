import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB(process.env.MONGODB_URI);

  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received, shutting down…`);
    server.close(async () => {
      await disconnectDB().catch(() => {});
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((err) => {
  console.error("[server] failed to start:", err.message);
  process.exit(1);
});
