import { motion } from "motion/react";
import { Heart, Brain, Baby, Activity, Pill, Microscope, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const specialtyList = [
  {
    title: "Cardiology",
    desc: "Comprehensive heart care using modern diagnostic tools and minimally invasive treatments.",
    icon: Heart,
    color: "bg-red-50 text-red-600",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Neurology",
    desc: "Advanced treatment for brain, spinal cord, and peripheral nerve disorders.",
    icon: Brain,
    color: "bg-blue-50 text-blue-600",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Pediatrics",
    desc: "Specialized healthcare for infants, children, and adolescents in a gentle environment.",
    icon: Baby,
    color: "bg-yellow-50 text-yellow-600",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Physical Therapy",
    desc: "Personalized rehabilitation programs to restore mobility and reduce pain.",
    icon: Activity,
    color: "bg-green-50 text-green-600",
    image: "https://images.unsplash.com/photo-1576091160550-217359f49a8c?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Pharmacy",
    desc: "24/7 on-site pharmacy with professional clinical guidance for all medications.",
    icon: Pill,
    color: "bg-purple-50 text-purple-600",
    image: "https://images.unsplash.com/photo-1587854692132-4bf1fe6eb7f2?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Laboratory",
    desc: "High-precision testing and rapid diagnostic reporting for accurate treatment.",
    icon: Microscope,
    color: "bg-blue-50 text-blue-600",
    image: "https://images.unsplash.com/photo-1579152276516-5c82363b361a?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Services() {
  return (
    <div className="pt-24 pb-24 bg-slate-50">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Specialties</h2>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
            Comprehensive <br/><span className="text-blue-600">Healthcare Solutions</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            From routine check-ups to advanced surgeries, our departments are equipped to handle any medical requirement with precision and care.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialtyList.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-md text-blue-600">
                  <service.icon size={24} />
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-8 flex-1 uppercase tracking-wider">
                  {service.desc}
                </p>
                <Link 
                  to="/appointments" 
                  className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-widest hover:text-blue-700 transition-colors"
                >
                  <span>Book Consultation</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="mt-32 max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 p-12 md:p-16 rounded-3xl flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-bold leading-tight">Can't find a specialty?</h3>
            <p className="text-slate-400">Talk to our general practitioners for a full assessment and referral.</p>
          </div>
          <Link 
            to="/contact" 
            className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-xs uppercase tracking-widest relative z-10"
          >
            Inquire Now
          </Link>
        </div>
      </section>
    </div>
  );
}
