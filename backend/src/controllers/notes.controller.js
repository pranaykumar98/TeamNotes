const Note = require("../models/note.model");

//create note
exports.createNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // tag is mandatory
    if (!tags || (Array.isArray(tags) && tags.length === 0)) {
      return res.status(400).json({ message: "At least one tag is required" });
    }

    // Support string or array
    let formattedTags = [];
    if (typeof tags === "string") {
      formattedTags = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    } else if (Array.isArray(tags)) {
      formattedTags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    }

    if (formattedTags.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one valid tag is required" });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      tags: formattedTags,
      createdBy: req.user.id || req.user._id,
    });

    return res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    next(error);
  }
};

//get all notes
exports.getAllNotes = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const search = req.query.search || "";

    const query = {
      createdBy: userId,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    };

    const notes = await Note.find(search ? query : { createdBy: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      total: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    next(error);
  }
};

//get single note
exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ note });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//update note
exports.updateNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      createdBy: req.user.id || req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (title) note.title = title.trim();
    if (content) note.content = content.trim();

    if (tags !== undefined) {
      let formattedTags = [];
      if (typeof tags === "string") {
        formattedTags = tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
      } else if (Array.isArray(tags)) {
        formattedTags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
      }

      if (formattedTags.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one valid tag is required" });
      }

      note.tags = formattedTags;
    }

    await note.save();
    return res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    next(error);
  }
};

//Delete Note
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
