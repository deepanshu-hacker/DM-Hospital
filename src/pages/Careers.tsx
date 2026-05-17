import { motion } from "motion/react";
import { Briefcase, Users, Heart, GraduationCap, MapPin, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const jobOpenings = [
  { 
    id: 1, 
    title: "Senior Cardiologist", 
    type: "Full-Time", 
    dept: "Cardiology",
    experience: "10+ Years",
    location: "Main Medical Campus"
  },
  { 
    id: 2, 
    title: "Registered Nurse (ICU)", 
    type: "Full-Time", 
    dept: "Critical Care",
    experience: "3+ Years",
    location: "Rohtak Unit"
  },
  { 
    id: 3, 
    title: "Medical Lab Technician", 
    type: "Contract", 
    dept: "Diagnostics",
    experience: "2+ Years",
    location: "Main Medical Campus"
  },
  { 
    id: 4, 
    title: "Patient Care Coordinator", 
    type: "Part-Time", 
    dept: "Administration",
    experience: "1+ Years",
    location: "Rohtak Unit"
  }
];

export default function Careers() {
  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
              Join Our Mission
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
              Build your <br />
              <span className="text-blue-600">Medical Legacy.</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              We're looking for passionate individuals who combine clinical precision with human compassion. Join DM Hospital and be part of a world-class medical team.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                { label: "Top Benefits", icon: Star },
                { label: "Learning Culture", icon: GraduationCap },
                { label: "Innovation", icon: Heart }
              ].map((pill, i) => (
                <div key={i} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <pill.icon size={16} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{pill.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative hidden lg:block"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=1000" 
                alt="Medical Team at DM Hospital" 
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]">
              <div className="flex items-center space-x-2 mb-4">
                <Users size={20} className="text-blue-600 font-bold" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Global Team</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">Join 200+ healthcare professionals in Rohtak.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-900 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "250+", label: "Employees" },
            { val: "15+", label: "Specialties" },
            { val: "5★", label: "Care Rating" },
            { val: "Top 10", label: "Employers" }
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-white mb-2">{stat.val}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Opportunities</h2>
            <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Open Clinical Positions</h3>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Total Openings: {jobOpenings.length}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobOpenings.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-8 rounded-2xl border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Briefcase size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    {job.type}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 uppercase tracking-tight">{job.title}</h4>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-600" /> {job.location}</span>
                    <span>•</span>
                    <span>{job.dept}</span>
                    <span>•</span>
                    <span>{job.experience} Exp</span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Job ID: DM-{job.id}0{i+1}</span>
                  <button className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-widest hover:text-blue-700 transition-colors group">
                    <span>Apply Now</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 p-12 md:p-20 rounded-3xl text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-4xl font-bold tracking-tight mb-8 relative z-10">Don't see your role?</h2>
          <p className="text-blue-100 mb-12 max-w-lg mx-auto relative z-10 text-lg">
            We're always looking for clinical excellence. Send your CV to our talent database for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a href="mailto:careers@dmhospital.com" className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">
              Drop CV (General)
            </a>
            <Link to="/contact" className="border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold hover:bg-white/10 transition-all text-xs uppercase tracking-widest">
              Talk to HR Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
