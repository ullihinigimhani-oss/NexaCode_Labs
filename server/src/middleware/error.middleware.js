import ApiError from '../utils/ApiError.js';
import { isProduction } from '../config/env.js';

export function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal server error.';

  if (!isProduction()) {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(!isProduction() && !error.isOperational ? { stack: error.stack } : {}),
  });
}
