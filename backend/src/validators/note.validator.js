const { body, validationResult } = require("express-validator");

// Common error handler
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

// Note Validator
exports.validateNote = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  body("tags").custom((tags) => {
    if (!tags) throw new Error("At least one tag is required");

    let formatted = [];
    if (typeof tags === "string") {
      formatted = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    } else if (Array.isArray(tags)) {
      formatted = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    } else {
      throw new Error("Tags must be an array or a comma-separated string");
    }

    if (formatted.length === 0)
      throw new Error("At least one valid tag is required");

    return true;
  }),

  handleValidationErrors,
];
