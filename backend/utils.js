/* ============================================================
   Shared utilities used across routes, controllers & services.
   ============================================================ */

/**
 * Escape a string for safe use inside a RegExp.
 * Skills like "REST APIs", "CI/CD", "Node.js" contain regex-special chars.
 */
export function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Create an Error carrying an HTTP status code.
 * Picked up by the error middleware in app.js, which reads `err.status`.
 * @param {number} status
 * @param {string} message
 * @returns {Error & { status: number }}
 */
export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/**
 * Wrap an async Express handler so any rejected promise is forwarded to
 * `next()` (and thus the error middleware) instead of crashing the process.
 * @param {(req,res,next)=>Promise<any>} fn
 */
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * True when `id` is a valid MongoDB ObjectId string.
 * @param {string} id
 */
export function isValidObjectId(id) {
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}
