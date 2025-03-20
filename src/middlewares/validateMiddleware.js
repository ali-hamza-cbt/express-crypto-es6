import { validationResult } from "express-validator";

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().reduce((acc, { path, msg }) => {
        acc[path] = msg;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check the errors.",
        errors: formattedErrors,
      });
    }

    next();
  };
};

export default validate;
