const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/notes.controller");
const { validateNote } = require("../validators/note.validator");

//to protect all the routes
router.use(auth);

router.post("/", validateNote, createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", validateNote, updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
