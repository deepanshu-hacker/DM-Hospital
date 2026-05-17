import { useState, type FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, User, Phone, Mail, FileText, CheckCircle2, ChevronRight, Loader2, Clock, Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "../lib/AuthContext";
import { db, auth } from "../lib/firebase";
import AuthForm from "../components/AuthForm";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
// ... (OperationType and FirestoreErrorInfo types remain same)

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function Appointments() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    date: "",
    message: ""
  });

  const specialties = [
    "General Consultation",
    "Cardiology",
    "Neurology", 
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
    "Mental Health"
  ];

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "appointments"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "appointments");
    });

    return () => unsubscribe();
  }, [user]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "appointments"), {
        userId: user.uid,
        patientName: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        department: formData.specialty,
        doctor: "Auto-Assigned Specialist",
        message: formData.message,
        status: "pending",
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "appointments");
      alert("Failed to save appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center pt-24 px-4 pb-12 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Request Received</h1>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Thank you for choosing DM Hospital. Our patient coordinator will contact you at <strong>{formData.phone}</strong> within 2 hours to confirm your time slot.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start py-12">
          {/* Info Side */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Appointment Portal</h2>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Better Health <br />
                <span className="text-slate-400 font-light">Starts Today.</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
                Book your clinical consultation in minutes. DM Hospital provides priority scheduling for all new patients.
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                { title: "Choose Your Specialty", icon: FileText },
                { title: "Pick Preferred Date", icon: Calendar },
                { title: "Immediate Confirmation", icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <item.icon size={18} />
                  </div>
                  <span className="text-slate-800 text-sm font-bold">{item.title}</span>
                </div>
              ))}
            </div>

            {/* History Section */}
            {user && bookings.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 pt-10"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Booking History</h3>
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">{bookings.length} Total</span>
                </div>
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{booking.department}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{booking.date}</p>
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full",
                          booking.status === 'pending' ? "bg-amber-50 text-amber-600" : 
                          booking.status === 'confirmed' ? "bg-emerald-50 text-emerald-600" :
                          "bg-slate-50 text-slate-400"
                        )}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100"
          >
            {!user ? (
              <div className="space-y-10 py-10">
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Security Access</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm">
                    Access our secure booking system by signing in with your preferred method.
                  </p>
                </div>
                
                <AuthForm />

                <div className="pt-6 flex items-center justify-center gap-2 border-t border-slate-50">
                  <ShieldCheck size={14} className="text-blue-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">HIPAA Compliant Security</span>
                </div>
              </div>
            ) : (
              <>
                {/* Progress Bar */}
                <div className="flex justify-between mb-12 relative h-1 bg-slate-100 rounded-full">
                  <div 
                    className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-500" 
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold -mt-3.5 z-10 transition-colors border-4 border-white shadow-sm",
                        s <= step ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {s}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Personal Background</h3>
                        <div className="space-y-4">
                          <div className="relative">
                            <User className="absolute left-4 top-4 text-slate-300" size={18} />
                            <input 
                              type="text" 
                              placeholder="Full Name" 
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                            />
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                            <input 
                              type="email" 
                              placeholder="Email Address" 
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                            />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-4 top-4 text-slate-300" size={18} />
                            <input 
                              type="tel" 
                              placeholder="Phone Number" 
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Preferred Services</h3>
                        <div className="space-y-4">
                          <div className="relative">
                            <FileText className="absolute left-4 top-4 text-slate-300" size={18} />
                            <select 
                              required
                              value={formData.specialty}
                              onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none text-slate-700 font-medium"
                            >
                              <option value="">Select Department</option>
                              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-4 text-slate-300" size={18} />
                            <input 
                              type="date" 
                              required
                              value={formData.date}
                              onChange={(e) => setFormData({...formData, date: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700 font-medium"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Clinical Context</h3>
                        <div className="space-y-4">
                          <textarea 
                            placeholder="Please describe symptoms or reason for visit..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-slate-700 font-medium placeholder:text-slate-300"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center space-x-4 pt-4">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 border-2 border-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95 text-xs uppercase tracking-widest"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={step === 3 ? undefined : handleNext}
                      className={cn(
                        "flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 active:scale-95 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest",
                        step === 3 ? "hidden" : "flex"
                      )}
                    >
                      <span>Continue</span>
                      <ChevronRight size={18} />
                    </button>
                    
                    {step === 3 && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={24} />
                        ) : (
                          <>
                            <span>Finish Booking</span>
                            <CheckCircle2 size={18} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
