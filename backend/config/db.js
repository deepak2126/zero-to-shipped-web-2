import mongoose from "mongoose";

/**
 * MongoDB connection with serverless-friendly caching.
 *
 * On Vercel (and similar serverless platforms) the module can be reused
 * across warm invocations, so we cache the connection on `global` to avoid
 * opening a new connection on every request. In local dev this behaves the
 * same as a normal single connection.
 */
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null, listeners: false };
}

function attachListeners() {
  // Register event listeners only once (avoid MaxListeners warnings on reuse).
  if (cached.listeners) return;
  cached.listeners = true;
  mongoose.connection.on("connected", () => {
    console.log("[db] MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB error:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected");
  });
}

/**
 * Connect to MongoDB using Mongoose (idempotent / cached).
 * @param {string} uri
 */
export async function connectDB(uri) {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to backend/.env (local) or your Vercel project's Environment Variables."
    );
  }
  if (cached.conn) return cached.conn;

  attachListeners();

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000 })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export async function disconnectDB() {
  cached.conn = null;
  cached.promise = null;
  await mongoose.connection.close();
}

