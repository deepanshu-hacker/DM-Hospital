import { motion } from "motion/react";
import { MessageSquare, Phone, MapPin, Mail, Clock, Send } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Contact() {
  return (
    <div className="pt-24 pb-24 bg-slate-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest pl-1">Connect With Us</h2>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Better Health <br />
                <span className="text-blue-600">Starts with a Call.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Have questions about our services or insurance coverage? Our patient support team is available 24/7 to assist you with any clinical inquiry.
              </p>
            </motion.div>

            <div className="grid gap-6">
              {[
                { title: "Emergency Line", val: "+91 9306431162", icon: Phone, color: "text-red-500 bg-red-50" },
                { title: "Direct Support", val: "+91 9306431162", icon: Phone, color: "text-blue-600 bg-blue-50" },
                { title: "Email Care", val: "itsdeepanshudc@gmail.com", icon: Mail, color: "text-blue-600 bg-blue-50" },
                { title: "Clinical Support", val: "24/7 Coverage", icon: Clock, color: "text-emerald-600 bg-emerald-50" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-6 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0", item.color)}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{item.title}</p>
                    <p className="text-lg font-bold text-slate-800 tracking-tight">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 md:p-14 rounded-3xl shadow-2xl border border-slate-100"
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 border-l-4 border-blue-600 pl-4">Digital Secure Portal</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">First Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300 text-slate-700 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Last Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300 text-slate-700 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Your Email</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-300 text-slate-700 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Inquiry Type</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-slate-700 font-medium">
                  <option>Medical Consultation</option>
                  <option>Billing & Insurance</option>
                  <option>General Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Message Detail</label>
                <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-6 focus:ring-2 focus:ring-blue-500 outline-none resize-none placeholder:text-slate-300 text-slate-700 transition-all" />
              </div>
              <button className="w-full bg-blue-600 text-white py-5 rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/10 flex items-center justify-center space-x-2 transition-all active:scale-95 text-xs uppercase tracking-widest">
                <span>Send via Secure Portal</span>
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-24 h-[400px] rounded-3xl overflow-hidden shadow-inner border border-slate-200 bg-white relative">
          <div className="absolute inset-0 bg-blue-600/5 flex items-center justify-center">
            <div className="text-center space-y-6">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mx-auto shadow-xl">
                  <MapPin size={32} />
               </div>
               <div className="space-y-2">
                 <p className="text-slate-800 font-bold tracking-tight">Main Medical Campus</p>
                 <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Rohtak</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
