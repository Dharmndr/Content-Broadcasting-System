import { config } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    success: false,
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    console.error(`[ERROR] ${req.method} ${req.url} - ${message}`);
    if (err.stack) console.error(err.stack);
  } else {
    // In production, we might want to log to a file or service
    console.error(`[ERROR] ${req.method} ${req.url} - ${statusCode} - ${message}`);
  }

  res.status(statusCode).send(response);
};
