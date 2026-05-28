import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import type { AppUser } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setAppUser(snap.data() as AppUser);
        } else {
          // Create user doc on first login
          const newUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: 'member',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Membre',
          };
          await setDoc(docRef, newUser);
          setAppUser(newUser);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    return signOut(auth);
  };

  const isAdmin = appUser?.role === 'admin';

  return { user, appUser, loading, isAdmin, login, register, loginWithGoogle, logout };
}
