import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Lock, 
  Phone, 
  User, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { cn } from "@/src/lib/utils";

type AuthMode = "options" | "email-signin" | "email-signup" | "phone";

export default function AuthForm() {
  const { 
    signInWithGoogle, 
    signInEmail, 
    signUpEmail, 
    setupRecaptcha, 
    signInPhone 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("options");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (mode === "phone") {
      // Small delay to ensure DOM is ready and AnimatePresence/motion finished mounting
      timeout = setTimeout(() => {
        setupRecaptcha("recaptcha-container");
      }, 100);
    }
    return () => clearTimeout(timeout);
  }, [mode, setupRecaptcha]);

  const handleAction = async (action: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      await action();
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/billing-not-enabled") {
        setError("Phone auth requires a Firebase 'Blaze' plan for real SMS. For testing, add 'Test Phone Numbers' in your Firebase Console, or use Google/Email sign-in.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = () => handleAction(signInWithGoogle);
  
  const onEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction(() => signInEmail(email, password));
  };

  const onEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction(() => signUpEmail(email, password, name));
  };

  const onPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    // Clean phone number (leave digits and + sign)
    let cleanedPhone = phoneNumber.replace(/[^0-9+]/g, '');
    
    // If it doesn't start with +, and seems like a long number, maybe suggest or require +
    if (!cleanedPhone.startsWith('+')) {
      // For some regions, adding a default + might work, but it's safer to ask the user.
      setError("Phone number must include '+' and country code (e.g. +91...)");
      return;
    }

    if (cleanedPhone.length < 10) {
      setError("Please enter a valid phone number with country code (e.g. +91 98765 43210)");
      return;
    }
    
    handleAction(async () => {
      const result = await signInPhone(cleanedPhone);
      setConfirmationResult(result);
    });
  };

  const onOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !otp) return;
    handleAction(async () => {
      await confirmationResult.confirm(otp);
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {mode === "options" && (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <button
              onClick={onGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 text-xs uppercase tracking-widest"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              Continue with Google
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-white px-4 text-slate-400 font-bold">Or use</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode("email-signin")}
                className="bg-slate-50 text-slate-600 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-blue-600 group-hover:scale-110 transition-transform">
                  <Mail size={18} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest pt-1">Email</p>
              </button>

              <button
                onClick={() => setMode("phone")}
                className="bg-slate-50 text-slate-600 p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all text-center space-y-2 group"
              >
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-emerald-600 group-hover:scale-110 transition-transform">
                  <Smartphone size={18} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest pt-1">Phone</p>
              </button>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
              New to DM Hospital?{" "}
              <button onClick={() => setMode("email-signup")} className="text-blue-600 hover:underline">Create Account</button>
            </p>
          </motion.div>
        )}

        {(mode === "email-signin" || mode === "email-signup") && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setMode("options")}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              <ChevronLeft size={14} /> Back
            </button>
            
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {mode === "email-signin" ? "Welcome Back" : "Create Account"}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {mode === "email-signin" ? "Enter your credentials to continue" : "Join our medical community"}
              </p>
            </div>

            <form onSubmit={mode === "email-signin" ? onEmailSignIn : onEmailSignUp} className="space-y-4">
              {mode === "email-signup" && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                />
              </div>

              {error && (
                <p className="text-[10px] font-bold text-red-500 bg-red-50 py-2 px-4 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    <span>{mode === "email-signin" ? "Sign In" : "Sign Up"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {mode === "email-signin" ? "Need an account? " : "Already have an account? "}
              <button 
                onClick={() => setMode(mode === "email-signin" ? "email-signup" : "email-signin")} 
                className="text-blue-600 hover:underline"
              >
                {mode === "email-signin" ? "Register" : "Sign In"}
              </button>
            </p>
          </motion.div>
        )}

        {mode === "phone" && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button 
              onClick={() => { setMode("options"); setConfirmationResult(null); }}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              <ChevronLeft size={14} /> Back
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Security Check</h3>
              <p className="text-xs text-slate-400 font-medium">Verify with your phone number</p>
            </div>

            {!confirmationResult ? (
              <form onSubmit={onPhoneSubmit} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                  />
                </div>
                <div id="recaptcha-container"></div>
                
                {error && (
                  <p className="text-[10px] font-bold text-red-500 bg-red-50 py-2 px-4 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={onOtpVerify} className="space-y-4">
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP" 
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium tracking-[0.5em]"
                  />
                </div>
                
                {error && (
                  <p className="text-[10px] font-bold text-red-500 bg-red-50 py-2 px-4 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      <span>Verify OTP</span>
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
