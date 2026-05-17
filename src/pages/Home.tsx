import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock, ShieldCheck, Users, Calendar, HeartPulse } from "lucide-react";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-12 px-4 overflow-hidden bg-white">
        {/* Background Accents */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 -z-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
            <circle cx="100" cy="50" r="50" className="text-blue-600" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">
              <Star size={12} className="fill-blue-700" />
              <span>Excellence in Care Since 1995</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Better Health <br />
              <span className="text-blue-600">Starts Today.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
              Combining world-class medical expertise with personalized compassionate care. Access the region's top specialists and state-of-the-art facilities.
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/appointments"
                className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Find a Specialist</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="w-full sm:w-auto border-2 border-slate-200 text-slate-700 px-10 py-4 rounded-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
              >
                Our Services
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
              <div>
                <p className="text-3xl font-bold text-slate-900">250+</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Doctors</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">15k+</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Patients</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">12+</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Awards</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                alt="Hospital Interior"
                className="w-full h-[550px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Overlay Cards */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -right-6 lg:-right-8 z-20 bg-white p-6 rounded-2xl shadow-2xl max-w-[240px] border border-slate-100"
            >
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Clock size={24} />
              </div>
              <p className="font-bold text-slate-800">24/7 Support</p>
              <p className="text-xs text-slate-400 mt-1">Our emergency services are always open for you.</p>
            </motion.div>
            
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute top-1/2 -left-6 lg:-left-12 z-20 bg-white p-6 rounded-3xl shadow-xl max-w-[200px] border border-gray-50"
            >
              <div className="flex -space-x-3 mb-4">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=doc${i}`} className="w-10 h-10 rounded-full border-2 border-white" alt="Doctor" />
                ))}
              </div>
              <p className="font-bold text-slate-800">Top Specialists</p>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Available today</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Our Professional Values</h2>
            <p className="text-4xl font-bold text-slate-900 tracking-tight">
              A standard of clinical excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Qualified Doctors", desc: "Our team includes board-certified specialists with decades of experience.", icon: Users },
              { title: "Secure Data", desc: "Your medical records are encrypted and handled with the strictest privacy.", icon: ShieldCheck },
              { title: "Modern Equipment", desc: "We invest in the latest diagnostic and imaging technology available.", icon: Star },
              { title: "Easy Scheduling", desc: "Book appointments instantly through our streamlined online booking system.", icon: Calendar },
              { title: "Quick Response", desc: "Our emergency and consultation wait times are kept to an absolute minimum.", icon: Clock },
              { title: "Holistic Approach", desc: "We focus on complete wellness, addressing both physical and mental health.", icon: HeartPulse },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group border border-slate-200 hover:border-blue-300"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-6 font-bold">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-xs">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto bg-blue-900 rounded-3xl p-12 md:p-20 relative overflow-hidden text-center text-white shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_120%,#FFFFFF_0%,transparent_50%)]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Better Outcomes <br/> Starts Here</h2>
            <p className="text-blue-100/70 text-lg">
              Join thousands of families who trust DM Hospital for clinical excellence.
            </p>
            <div className="pt-6">
              <Link
                to="/appointments"
                className="inline-flex items-center space-x-3 bg-white text-blue-900 px-10 py-5 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest"
              >
                <span>Book Appointment</span>
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="text-[10px] text-blue-100/40 uppercase tracking-[0.3em] font-bold pt-4">Joint Commission Accredited Facility</div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
