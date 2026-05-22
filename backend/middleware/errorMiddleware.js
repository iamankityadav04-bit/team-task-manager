import mongoose from 'mongoose';

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = err.errors || [];

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((item) => item.message);
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value already exists';
    errors = Object.keys(err.keyValue || {}).map((key) => `${key} already exists`);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
