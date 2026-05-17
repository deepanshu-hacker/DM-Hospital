import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  Activity,
  UserCircle,
  FileText
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const path = "appointments";
    const q = query(
      collection(db, path),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
          <UserCircle size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Please Sign In</h2>
          <p className="text-slate-500 max-w-xs">You need to be authenticated to view your profile and appointments.</p>
        </div>
        <button 
          onClick={() => navigate("/appointments")}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Profile Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 text-white border-4 border-white">
                  {user.photoURL ? (
                    <img src={user.photoURL} className="w-full h-full object-cover rounded-[1.2rem]" alt={user.displayName || "User"} />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">{user.displayName || "Patient Account"}</h2>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Verified Member</p>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white group">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-white group">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-sm font-semibold text-slate-700">{user.phoneNumber || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="mt-10 w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10 text-xs uppercase tracking-widest"
              >
                <LogOut size={16} />
                Logout Account
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={24} />
                <h3 className="font-bold text-lg">Health Shield</h3>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                Your medical data is protected with 256-bit encryption and HIPAA-compliant standards.
              </p>
            </motion.div>
          </div>

          {/* Main Content (Appointments) */}
          <div className="md:col-span-8 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Care History</h1>
              <p className="text-slate-500">Manage your upcoming and past medical consultations</p>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 gap-4">
                  <Activity className="animate-pulse text-blue-500" size={32} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Retrieving Health Records...</p>
                </div>
              ) : appointments.length > 0 ? (
                appointments.map((apt, idx) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg hover:border-blue-100 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Calendar size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-xs tracking-wider">{apt.service || "Medical Consultation"}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                            <Calendar size={14} />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg text-emerald-600">
                            <Clock size={14} />
                            {apt.slot || "10:00 AM"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="flex-1 md:flex-none">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Confirmed
                        </span>
                      </div>
                      <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                        <FileText size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Appointments Yet</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                    Your health journey starts with your first consultation. Book one today!
                  </p>
                  <button 
                    onClick={() => navigate("/appointments")}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-extrabold shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    Schedule Now
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
