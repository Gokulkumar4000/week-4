import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, InsertUser } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: InsertUser, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Set loading timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firestore connection timeout')), 10000)
          );
          
          const userDocPromise = getDoc(doc(db, "users", firebaseUser.uid));
          const userDoc = await Promise.race([userDocPromise, timeoutPromise]) as any;
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              department: userData.department,
              employeeId: userData.employeeId,
              createdAt: userData.createdAt?.toDate() || new Date(),
            });
          } else {
            // If user document doesn't exist, create a basic user from email
            const email = firebaseUser.email || '';
            const isHR = email.includes('gokul@gncipl.com');
            const basicUser = {
              id: firebaseUser.uid,
              email: email,
              name: isHR ? 'Gokul' : 'Gokulkumar',
              role: isHR ? 'hr' as const : 'employee' as const,
              department: isHR ? 'Human Resources' : 'Engineering',
              employeeId: isHR ? undefined : 'EMP001',
              createdAt: new Date(),
            };
            setUser(basicUser);
            
            // Try to save to Firestore (non-blocking)
            try {
              await setDoc(doc(db, "users", firebaseUser.uid), basicUser);
            } catch (saveError) {
              console.warn("Could not save user to Firestore:", saveError);
            }
          }
        } catch (error: any) {
          console.error("Error fetching user data:", error);
          
          // Fallback: create user from Firebase auth info
          if (firebaseUser.email) {
            const email = firebaseUser.email;
            const isHR = email.includes('gokul@gncipl.com');
            const fallbackUser = {
              id: firebaseUser.uid,
              email: email,
              name: isHR ? 'Gokul' : 'Gokulkumar',
              role: isHR ? 'hr' as const : 'employee' as const,
              department: isHR ? 'Human Resources' : 'Engineering',
              employeeId: isHR ? undefined : 'EMP001',
              createdAt: new Date(),
            };
            setUser(fallbackUser);
          } else {
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData: InsertUser, password: string) => {
    setLoading(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, userData.email, password);
      
      const userDoc = {
        ...userData,
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, "users", firebaseUser.uid), userDoc);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
