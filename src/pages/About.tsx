import { motion } from "motion/react";
import { Award, Heart, Shield, Users } from "lucide-react";

export default function About() {
  return (
    <div className="pt-24 pb-24 bg-slate-50">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-white">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-blue-600/5 rotate-12 translate-x-1/2 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
              Established 1995
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
              A Legacy of <br />
              <span className="text-blue-600">Care & Innovation</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              DM Hospital has been at the forefront of medical advancement, treating every patient with dignity and world-class expertise for nearly three decades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Our Core Mission</h2>
              <p className="text-3xl font-bold text-slate-800 leading-tight">
                Empowering patients through clinical excellence and compassionate care.
              </p>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed">
              We empower our patients by offering high-quality clinical care, education, and comprehensive wellbeing services. Our center was built on the belief that everyone deserves access to state-of-the-art medical technology without losing the personal connection that healing requires.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              {[
                { title: "Empathetic", icon: Heart },
                { title: "Excellence", icon: Award },
                { title: "Integrity", icon: Shield },
                { title: "Community", icon: Users },
              ].map((val, i) => (
                <div key={i} className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <val.icon className="text-blue-600" size={20} />
                  <span className="font-bold text-slate-700 text-sm tracking-tight">{val.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1505751172107-16d7a46f9037?auto=format&fit=crop&q=80&w=1000" 
                alt="Modern Hospital Room" 
                className="w-full h-auto aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-slate-900 p-10 rounded-2xl shadow-2xl text-white hidden md:block">
              <p className="text-5xl font-bold mb-2">30+</p>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Years of Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Leadership Team</h2>
            <h3 className="text-4xl font-bold text-slate-900">Led by world specialists</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="group cursor-pointer">
                <div className="mb-6 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-lg group-hover:shadow-blue-200/50">
                  <img src={`https://i.pravatar.cc/400?u=docLarge${i}`} alt="Specialist" className="w-full h-80 object-cover" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 tracking-tight">Dr. Sarah Jenkins</h4>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-widest pt-1">Head of Cardiology</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
