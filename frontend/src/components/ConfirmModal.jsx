import { useRef, useEffect } from "react";
import { AlertTriangle, Trash2, XCircle, X } from "lucide-react"; 

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  const modalRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <div
        ref={modalRef}
        className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl p-6 sm:p-8 w-full max-w-md lg:max-w-xl shadow-2xl border border-indigo-100 transition-all transform scale-100 animate-fadeIn"
      >
 
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center justify-center mb-4 text-red-600">
          <AlertTriangle className="w-10 h-10" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-700 text-center mb-8 text-base leading-relaxed">
          {message}
        </p>

  
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
          >
            <XCircle className="w-5 h-5 text-gray-600" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow-md hover:opacity-90 hover:scale-[1.02] transition-all"
          >
            <Trash2 className="w-5 h-5 text-white" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
