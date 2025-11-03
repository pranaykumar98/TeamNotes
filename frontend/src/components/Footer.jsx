import { Link } from "react-router-dom";
import { Heart } from "lucide-react"; 

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 w-full bg-gradient-to-r from-gray-200 via-slate-100 to-gray-300 backdrop-blur-lg border-t border-gray-300 shadow-md">
      <div className="w-full flex justify-center">
        <div className="w-full px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-700">
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <span className="font-medium text-gray-700">
              &copy; {new Date().getFullYear()} TeamNotes
            </span>

            <Link
              to="/"
              className="hover:underline hover:text-indigo-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/"
              className="hover:underline hover:text-indigo-600 transition-colors"
            >
              Terms
            </Link>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600 text-center sm:text-right">
            <span className="flex items-center gap-1">
              Powered by <strong className="text-gray-800">TeamNotes</strong> —
              Crafted with precision and excellence
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse ml-1" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
