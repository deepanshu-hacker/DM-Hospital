import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  setupRecaptcha: (containerId: string) => void;
  signInPhone: (phone: string) => Promise<ConfirmationResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Check if admin
          const adminRef = doc(db, 'admins', currentUser.uid);
          const adminDoc = await getDoc(adminRef);
          const adminExists = adminDoc.exists();
          const isHardcodedAdmin = currentUser.email === 'itsdeepanshudc@gmail.com' || currentUser.email === 'deepanshuchopra0786@gmail.com';
          setIsAdmin(adminExists || isHardcodedAdmin);

          // Auto-bootstrap admin if email matches and not already in collection
          if (isHardcodedAdmin && !adminExists) {
            try {
              await setDoc(adminRef, {
                email: currentUser.email,
                createdAt: serverTimestamp()
              });
              setIsAdmin(true);
            } catch (bootstrapErr) {
              console.warn("Admin bootstrap failed - check security rules", bootstrapErr);
            }
          }

          // Sync user profile to Firestore
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              phoneNumber: currentUser.phoneNumber || '',
              createdAt: serverTimestamp()
            });
          }
        } catch (err) {
          console.error("Auth sync error:", err);
          // Don't use handleFirestoreError here as it throws, which could break auth flow
        }
      } else {
        setIsAdmin(false);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signUpEmail = async (email: string, pass: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(result.user, { displayName: name });
  };

  const signInEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const setupRecaptcha = (containerId: string) => {
    try {
      if (recaptchaVerifier) return;
      const el = document.getElementById(containerId);
      if (!el) return;

      const verifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible'
      });
      setRecaptchaVerifier(verifier);
    } catch (error) {
      console.error("Failed to setup Recaptcha", error);
    }
  };

  const signInPhone = async (phone: string) => {
    if (!recaptchaVerifier) {
      // Fallback: try to initialize it now if the container exists
      const containerId = "recaptcha-container";
      const el = document.getElementById(containerId);
      if (el) {
        const verifier = new RecaptchaVerifier(auth, containerId, {
          'size': 'invisible'
        });
        setRecaptchaVerifier(verifier);
        return await signInWithPhoneNumber(auth, phone, verifier);
      }
      throw new Error("Security verification (Recaptcha) is still initializing. Please wait a moment and try again.");
    }
    return await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin,
      loading, 
      signInWithGoogle, 
      signUpEmail, 
      signInEmail, 
      setupRecaptcha,
      signInPhone,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
