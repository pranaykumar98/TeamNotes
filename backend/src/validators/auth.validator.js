const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(", ");
    return res.status(400).json({ message });
  }
  next();
};

//signup validation
exports.validateSignup = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be atleast 2 characters long"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long"),
  handleValidationErrors,
];

//login validation
exports.validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("password is required"),
  handleValidationErrors,
];
