import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Search, 
  Plus, 
  FileText, 
  Filter,
  MoreVertical,
  ChevronRight,
  User,
  Mail,
  Phone,
  Clock,
  ShieldAlert,
  ArrowLeft,
  Edit2,
  Trash2,
  PauseCircle,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  deleteDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export default function AdminPortal() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New/Edit Booking Form State
  const initialFormState = {
    patientName: "",
    email: "",
    phone: "",
    date: "",
    slot: "10:00 AM",
    department: "General Medicine",
    doctor: "Dr. Smith",
    status: "confirmed",
    adminRemark: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const path = "appointments";
    const q = query(collection(db, path), orderBy("createdAt", "desc"));
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
  }, [isAdmin]);

  const updateStatus = async (id: string, status: string) => {
    const path = `appointments/${id}`;
    try {
      await updateDoc(doc(db, "appointments", id), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    const path = editingBooking ? `appointments/${editingBooking.id}` : "appointments";
    
    try {
      if (editingBooking) {
        await updateDoc(doc(db, "appointments", editingBooking.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, "appointments"), {
          ...formData,
          userId: "admin-" + user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      setShowAddModal(false);
      setEditingBooking(null);
      setFormData(initialFormState);
    } catch (error) {
      handleFirestoreError(error, editingBooking ? OperationType.UPDATE : OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (apt: any) => {
    setEditingBooking(apt);
    setFormData({
      patientName: apt.patientName || "",
      email: apt.email || "",
      phone: apt.phone || "",
      date: apt.date || "",
      slot: apt.slot || "10:00 AM",
      department: apt.department || "General Medicine",
      doctor: apt.doctor || "Dr. Smith",
      status: apt.status || "pending",
      adminRemark: apt.adminRemark || ""
    });
    setShowAddModal(true);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteBooking = async (id: string) => {
    const path = `appointments/${id}`;
    try {
      await deleteDoc(doc(db, "appointments", id));
      setDeletingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         apt.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <ShieldAlert className="text-blue-600 mb-4 animate-bounce" size={48} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verifying Admin Credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <ShieldAlert size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Administrative Control Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Booking Management</h1>
            <p className="text-slate-500 text-sm">Review, verify and coordinate all patient appointments</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-600/20 text-xs uppercase tracking-widest"
            >
              <Plus size={18} />
              New Booking
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Bookings", value: appointments.length, color: "blue" },
            { label: "Pending", value: appointments.filter(a => a.status === 'pending').length, color: "amber" },
            { label: "Confirmed", value: appointments.filter(a => a.status === 'confirmed').length, color: "emerald" },
            { label: "Cancelled", value: appointments.filter(a => a.status === 'cancelled').length, color: "slate" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={cn("text-2xl font-black", 
                stat.color === 'blue' ? "text-blue-600" : 
                stat.color === 'amber' ? "text-amber-500" :
                stat.color === 'emerald' ? "text-emerald-500" : "text-slate-400"
              )}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by patient name or email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["all", "pending", "confirmed", "hold", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "whitespace-nowrap px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                  filterStatus === status 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-32 text-center space-y-4">
              <Clock className="animate-spin text-blue-600 mx-auto" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Database...</p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt, idx) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:border-blue-100 transition-all group"
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                  {/* Patient Info */}
                  <div className="flex items-start gap-4 min-w-[240px]">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all shrink-0">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-xs tracking-wider">{apt.patientName}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">{apt.email}</p>
                      <p className="text-xs text-slate-500 font-medium">{apt.phone}</p>
                      
                      {apt.adminRemark && (
                        <div className="mt-3 flex items-start gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-100/50 max-w-[200px]">
                          <MessageSquare size={12} className="text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-[10px] text-amber-700 italic leading-tight line-clamp-2">{apt.adminRemark}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule</p>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Calendar size={14} className="text-blue-500" />
                        {apt.date}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                        <Clock size={12} />
                        {apt.slot || "10:00 AM"}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Team</p>
                      <div className="text-sm font-bold text-slate-700 truncate">{apt.doctor}</div>
                      <div className="text-[10px] font-semibold text-slate-500">{apt.department}</div>
                    </div>

                    <div className="space-y-1 hidden md:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                      <div className="flex items-center gap-2">
                         <span className={cn(
                           "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                           apt.status === 'confirmed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                           apt.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100" :
                           apt.status === 'cancelled' ? "bg-slate-50 text-slate-500 border-slate-200" :
                           "bg-blue-50 text-blue-700 border-blue-100"
                         )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full",
                              apt.status === 'confirmed' ? "bg-emerald-500" :
                              apt.status === 'pending' ? "bg-amber-500 animate-pulse" :
                              apt.status === 'cancelled' ? "bg-slate-400" :
                              "bg-blue-500"
                            )} />
                            {apt.status}
                         </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <button 
                      onClick={() => openEditModal(apt)}
                      className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      title="Edit Booking"
                    >
                      <Edit2 size={18} />
                    </button>

                    <div className="w-px h-8 bg-slate-100 mx-1"></div>

                    {apt.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(apt.id, 'confirmed')}
                        className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Confirm"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}

                    {apt.status !== 'hold' && apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <button 
                        onClick={() => updateStatus(apt.id, 'hold')}
                        className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                        title="Put on Hold"
                      >
                        <PauseCircle size={18} />
                      </button>
                    )}

                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <button 
                        onClick={() => updateStatus(apt.id, 'completed')}
                        className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="Mark Completed"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}

                    {apt.status !== 'cancelled' && (
                      <button 
                        onClick={() => updateStatus(apt.id, 'cancelled')}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Cancel"
                      >
                        <XCircle size={18} />
                      </button>
                    )}

                    <div className="w-px h-8 bg-slate-100 mx-1"></div>

                    {deletingId === apt.id ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl border border-red-100">
                        <button 
                          onClick={() => deleteBooking(apt.id)}
                          className="px-3 py-2 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition-all uppercase tracking-tighter"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)}
                          className="px-3 py-2 bg-white text-slate-400 text-[10px] font-bold rounded-lg hover:border-slate-200 transition-all uppercase tracking-tighter"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeletingId(apt.id)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[2rem] text-center border-2 border-dashed border-slate-100">
               <Search className="mx-auto text-slate-200 mb-4" size={48} />
               <h3 className="font-bold text-slate-900">No bookings found</h3>
               <p className="text-slate-500 text-sm">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Booking Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    {editingBooking ? <Edit2 size={20} /> : <Plus size={20} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{editingBooking ? "Edit Appointment" : "Manual Booking"}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{editingBooking ? "Updating Record" : "Admin Create"}</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveBooking} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Patient Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.patientName}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Status</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="hold">Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Doctor</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.doctor}
                      onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Admin Remark / Notes</label>
                  <textarea 
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Add internal notes about this patient or booking..."
                    value={formData.adminRemark}
                    onChange={(e) => setFormData({...formData, adminRemark: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-3xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20"
                >
                  {isSubmitting ? "Processing..." : editingBooking ? "Update Health Record" : "Process Official Booking"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
