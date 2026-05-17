import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <div className="bg-blue-900 text-white py-2 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-semibold tracking-wide uppercase">
      <div className="flex items-center gap-4 sm:gap-6">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 
          Emergency 24/7: +91 9306431162
        </span>
        <span className="hidden md:flex items-center gap-2">
          <MapPin size={12} className="text-blue-300" />
          Rohtak
        </span>
      </div>
      <div className="flex items-center gap-4 mt-1 sm:mt-0">
        <Link to="/careers" className="hover:text-blue-200 transition-colors">Careers</Link>
      </div>
    </div>
  );
}
