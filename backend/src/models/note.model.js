const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [200, "Title too long (max 200 chars)"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        Array.from(
          new Set(
            (tags || [])
              .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
              .filter(Boolean)
          )
        ),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);
