import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import NoteModal from "../components/NoteModal";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { NotebookPen, Edit3, Trash2, Plus, Sparkles, Search } from "lucide-react"; 

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  //Fetch notes 
  const fetchNotes = async (term = "") => {
    try {
      setLoading(true);
      const res = await apiClient.get("/notes", {
        params: term ? { search: term } : {},
      });
      if (res?.status === 200) {
        const data = Array.isArray(res.data) ? res.data : res.data.notes || [];
        setNotes(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (responseData) => {
    const updatedNote = responseData.note || responseData;
    if (selectedNote) {
      setNotes((prev) =>
        prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
      );
    } else {
      setNotes((prev) => [updatedNote, ...prev]);
    }
    setSelectedNote(null);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    try {
      const res = await apiClient.delete(`/notes/${noteToDelete._id}`);
      if (res?.status === 200) {
        setNotes((prev) => prev.filter((n) => n._id !== noteToDelete._id));
        setNoteToDelete(null);
        setDeleteModalOpen(false);
        toast.success(`${noteToDelete?.title} deleted successfully`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Debounced Search Effect
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchNotes(searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md w-full rounded-b-lg transition-all">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-center sm:text-left">
          <NotebookPen className="w-6 sm:w-7 h-6 sm:h-7" />
          My Notes
        </h1>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-md hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" /> Add Note
        </button>
      </header>

      {/* Search Bar */}
      <div className="w-full flex justify-end mt-6 px-4 pr-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search notes by title, content, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Notes Container */}
      <main className="flex-1 p-8 overflow-auto w-full mx-auto">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <p className="text-gray-600 italic text-lg mb-3">
              No notes found.{" "}
              <button
                onClick={handleAdd}
                className="text-indigo-600 hover:underline font-semibold"
              >
                Add one
              </button>{" "}
              to get started!
            </p>
            <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
              Organize your thoughts and ideas beautifully
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note) => (
              <li
                key={note._id}
                className="flex flex-col justify-between bg-gradient-to-br from-indigo-100/70 via-white to-blue-100/70 backdrop-blur-md rounded-2xl shadow-lg border border-indigo-200 hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 overflow-hidden"
              >
                {/* Note Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-2xl text-gray-900 mb-3 tracking-wide">
                    {note.title}
                  </h3>
                  <p className="text-gray-800 text-base mb-5 flex-grow leading-relaxed">
                    {note.content}
                  </p>

                  {/* Tags Section */}
                  <div className="min-h-[28px] mb-3">
                    {note.tags && note.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-indigo-200 to-blue-200 text-indigo-800 text-sm px-3 py-1 rounded-full font-semibold border border-indigo-300 shadow-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[20px]"></div>
                    )}
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 sm:px-6 py-3 border-t border-indigo-100">
                  <span className="text-gray-700 text-base font-medium w-full sm:w-auto text-center sm:text-left">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex flex-wrap justify-center sm:justify-end w-full sm:w-auto gap-3">
                    <button
                      onClick={() => handleEdit(note)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-md transition-all w-full sm:w-auto"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>

                    <button
                      onClick={() => {
                        setNoteToDelete(note);
                        setDeleteModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-md shadow-md transition-all w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Modals */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSuccess={handleSuccess}
        initialNote={selectedNote}
      />
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Note"
        message={`Are you sure you want to delete "${noteToDelete?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setNoteToDelete(null);
        }}
      />
    </div>
  );
}
