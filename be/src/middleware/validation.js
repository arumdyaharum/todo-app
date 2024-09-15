import { validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: `Validation error\n- ${errors.array().map(x => x.msg).join('\n- ')}`,
      errors: errors.array()
    });
  }
  next();
};

export default handleValidationErrors