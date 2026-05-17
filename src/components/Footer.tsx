import { Link } from "react-router-dom";
import { HeartPulse, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-slate-800 pb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center text-white">
                <HeartPulse size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">DM<span className="text-blue-500">Hospital</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Providing world-class healthcare with a personal touch. Accredited by the Joint Commission for clinical excellence.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Patient Resources</h4>
            <ul className="space-y-4">
              {[
                { name: "Find a Doctor", path: "/about" },
                { name: "Specialties", path: "/services" },
                { name: "Careers", path: "/careers" },
                { name: "Support Center", path: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-400 text-sm hover:text-blue-400 transition-colors uppercase tracking-widest font-bold">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Medical Services</h4>
            <ul className="space-y-4">
              {["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Emergency Care"].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-slate-400 text-sm hover:text-blue-400 transition-colors">{service}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <span className="text-slate-400 text-sm leading-relaxed">Rohtak</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span className="text-slate-400 text-sm">+91 9306431162</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <span className="text-slate-400 text-sm">itsdeepanshudc@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] uppercase tracking-widest font-bold">
          <div className="space-y-1">
            <p className="text-slate-500">
              &copy; {currentYear} DM Hospital Systems. All rights reserved.
            </p>
            <p className="text-blue-500/60">Made by Deepanshu</p>
          </div>
          <div className="flex space-x-6 text-white">
            <span className="flex items-center gap-2 font-bold uppercase">5-Star Rated Facility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
