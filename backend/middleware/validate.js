import mongoose from 'mongoose';
import validator from 'validator';
import { ApiError } from '../utils/apiError.js';

export const validate = (rules) => (req, _res, next) => {
  const errors = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = req.body[field];

    if (fieldRules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value === undefined || value === null || value === '') continue;

    if (fieldRules.email && !validator.isEmail(String(value))) {
      errors.push(`${field} must be a valid email`);
    }

    if (fieldRules.min && String(value).length < fieldRules.min) {
      errors.push(`${field} must be at least ${fieldRules.min} characters`);
    }

    if (fieldRules.enum && !fieldRules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${fieldRules.enum.join(', ')}`);
    }

    if (fieldRules.objectId && !mongoose.Types.ObjectId.isValid(value)) {
      errors.push(`${field} must be a valid id`);
    }

    if (fieldRules.objectIdArray && (!Array.isArray(value) || value.some((id) => !mongoose.Types.ObjectId.isValid(id)))) {
      errors.push(`${field} must be an array of valid ids`);
    }

    if (fieldRules.date && Number.isNaN(Date.parse(value))) {
      errors.push(`${field} must be a valid date`);
    }
  }

  if (errors.length) {
    return next(new ApiError(400, 'Invalid request data', errors));
  }

  next();
};

export const validateObjectId = (paramName = 'id') => (req, _res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return next(new ApiError(400, 'Invalid resource id'));
  }
  next();
};
