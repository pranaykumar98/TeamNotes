import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Grid,
  PieChart,
  LogOut,
  StickyNote,
  User,
} from "lucide-react"; 

export default function Header({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/notes", label: "Notes", icon: Grid },
    { to: "/analytics", label: "Analytics", icon: PieChart },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-gray-200 via-slate-100 to-gray-300 border-b border-gray-300 shadow-md backdrop-blur-lg transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="h-16 flex items-center justify-between">
         
          <Link
            to="/notes"
            className="flex items-center gap-3 hover:opacity-90 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center shadow-md">
              <StickyNote className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-gray-800 tracking-wide">
                TeamNotes
              </span>
              <p className="text-xs text-gray-500 -mt-0.5">
                Organize • Create • Analyze
              </p>
            </div>
          </Link>

         
          <div className="hidden md:flex items-center gap-6">
            {/* User Info */}
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold">
                {user?.name ? `Hello, ${user.name}` : "Hello, User"}
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                          : "text-gray-700 hover:text-indigo-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold rounded-full hover:opacity-90 shadow-md transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/*Hamburger (Mobile) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {open ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gradient-to-b from-gray-100 to-gray-200 border-t border-gray-300 shadow-lg backdrop-blur-md animate-slideDown">
          <div className="px-4 py-4">
            {/* Navigation */}
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <div key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 rounded-md transition-all duration-200"
                  >
                    
                    <span className="font-medium">{link.label}</span>
                  </Link>

                  
                  {index < navLinks.length - 1 && (
                    <div className="border-b border-gray-300/60 mx-2 my-1"></div>
                  )}
                </div>
              );
            })}

            {/* Logout */}
            <div className="border-t border-gray-300/70 mt-4 pt-3 flex justify-end">
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-md hover:opacity-90 text-sm font-semibold transition-all shadow-md"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
