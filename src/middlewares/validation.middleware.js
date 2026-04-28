import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessage = errors.array().map((err) => err.msg).join(', ');
    return next(new ApiError(400, errorMessage));
  };
};

export default validate;
