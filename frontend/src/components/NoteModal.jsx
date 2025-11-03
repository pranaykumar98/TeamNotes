import { useState, useEffect, useRef } from "react";
import { Edit3, PlusSquare, X } from "lucide-react";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";

export default function NoteModal({
  isOpen,
  onClose,
  onSuccess,
  initialNote = null,
}) {
  const isEditMode = !!initialNote;
  const [note, setNote] = useState({ title: "", content: "", tags: "" });
  const [errors, setErrors] = useState({ title: "", content: "", tags: "" });
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Prefill form when editing
  useEffect(() => {
    if (initialNote) {
      setNote({
        title: initialNote.title || "",
        content: initialNote.content || "",
        tags: Array.isArray(initialNote.tags)
          ? initialNote.tags.join(", ")
          : initialNote.tags || "",
      });
    } else {
      setNote({ title: "", content: "", tags: "" });
    }
    setErrors({ title: "", content: "", tags: "" });
  }, [initialNote]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose(); 
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

 
  const handleClose = () => {
    setNote({ title: "", content: "", tags: "" });
    setErrors({ title: "", content: "", tags: "" });
    onClose();
  };

  const handleChange = (field, value) => {
    setNote({ ...note, [field]: value });

    if (field === "title") {
      setErrors((prev) => ({
        ...prev,
        title: value.trim() ? "" : "Title is required",
      }));
    } else if (field === "content") {
      setErrors((prev) => ({
        ...prev,
        content: value.trim() ? "" : "Content is required",
      }));
    } else if (field === "tags") {
      const validTags = value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      setErrors((prev) => ({
        ...prev,
        tags: validTags.length > 0 ? "" : "At least one tag is required",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = { title: "", content: "", tags: "" };
    let hasError = false;

    if (!note.title.trim()) {
      tempErrors.title = "Title is required";
      hasError = true;
    }
    if (!note.content.trim()) {
      tempErrors.content = "Content is required";
      hasError = true;
    }

    const formattedTags = note.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (formattedTags.length === 0) {
      tempErrors.tags = "At least one tag is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(tempErrors);
      return;
    }

    const formattedNote = {
      ...note,
      tags: formattedTags,
    };

    try {
      setLoading(true);
      let res;
      if (isEditMode) {
        res = await apiClient.put(`/notes/${initialNote._id}`, formattedNote);
        if (res?.status === 200) {
          toast.success("Note updated successfully");
          setNote({ title: "", content: "", tags: "" });
        }
      } else {
        res = await apiClient.post("/notes", formattedNote);
        if (res?.status === 201) {
          toast.success("Note created successfully");
          setNote({ title: "", content: "", tags: "" });
        }
      }
      onSuccess(res.data);
      handleClose(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div
        ref={modalRef}
        className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl p-6 sm:p-8 w-full max-w-lg lg:max-w-2xl shadow-2xl border border-indigo-100 transition-all transform scale-100 animate-fadeIn"
      >
        {/* X Button */}
        <button
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center flex items-center justify-center gap-3">
          {isEditMode ? (
            <>
              <Edit3 className="w-6 h-6 text-indigo-600" /> Edit Note
            </>
          ) : (
            <>
              <PlusSquare className="w-6 h-6 text-indigo-600" /> Create New Note
            </>
          )}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={note.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border text-gray-800 text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter note title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Content Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={note.content}
              onChange={(e) => handleChange("content", e.target.value)}
              rows="5"
              className={`w-full px-4 py-3 rounded-lg border text-gray-800 text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Write your note..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* Tags Field */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              Tags (comma-separated) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={note.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="e.g., personal, work, ideas"
              className={`w-full px-4 py-3 rounded-lg border text-gray-800 text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                errors.tags ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
            )}
            <p className="text-sm text-gray-500 mt-1 italic">
              Separate tags with commas (e.g., personal, work, urgent)
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update Note"
                : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
