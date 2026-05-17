import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, HeartPulse, User, LogOut, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "../lib/AuthContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Appointments", href: "/appointments" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-white py-4 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm group-hover:shadow-blue-200/50 transition-all">
              <HeartPulse size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">DM<span className="text-blue-600">Hospital</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-blue-600",
                    location.pathname === link.href ? "text-blue-600" : "text-slate-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all overflow-hidden border border-blue-100">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || "User"} />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest hidden lg:block">Profile</span>
                  </Link>

                  {isAdmin && (
                    <Link 
                      to="/admin"
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                    >
                      Admin
                    </Link>
                  )}

                  <button 
                    onClick={() => signOut()}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/appointments"
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Sign In
                </Link>
              )}
              <Link
                to="/appointments"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest"
              >
                Book
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-600 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-3 rounded-lg text-base font-medium transition-colors",
                    location.pathname === link.href ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 space-y-3 px-3">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 w-full p-4 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{user.displayName || "Patient"}</p>
                        <p className="text-xs text-slate-500">View Appointments</p>
                      </div>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 w-full p-4 rounded-xl bg-blue-50 border border-blue-100"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                          <ShieldAlert size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-blue-900">Admin Portal</p>
                          <p className="text-xs text-blue-600">Manage Bookings</p>
                        </div>
                      </Link>
                    )}

                    <button
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="block w-full text-center bg-slate-100 text-slate-700 px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Logout Account
                    </button>
                  </>
                ) : (
                  <Link
                    to="/appointments"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-slate-900 text-white px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-widest"
                  >
                    Patient Sign In
                  </Link>
                )}
                
                <Link
                  to="/appointments"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-blue-600 text-white px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-600/10"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
