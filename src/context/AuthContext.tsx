import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile } from '../types/user';
import { getUserProfile, saveUserProfile, bootstrapAdmin } from '../lib/firestoreService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  grantAdminRole: (secretKey?: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'gg_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check initial local session or Firebase
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setCurrentUser(fbUser);
        if (fbUser) {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            // Create default customer profile
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Glimmer Customer',
              photoURL: fbUser.photoURL || undefined,
              role: 'customer',
              isAdmin: false,
              createdAt: new Date().toISOString()
            };
            await saveUserProfile(newProfile);
            setUserProfile(newProfile);
          }
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local fallback mode authentication
      try {
        const savedSession = localStorage.getItem(LOCAL_SESSION_KEY);
        if (savedSession) {
          const profile = JSON.parse(savedSession) as UserProfile;
          setUserProfile(profile);
          // Synthetic user object
          setCurrentUser({
            uid: profile.uid,
            email: profile.email,
            displayName: profile.displayName,
          } as unknown as User);
        }
      } catch (err) {
        console.warn('Error reading local auth session:', err);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const profile = await getUserProfile(userCredential.user.uid);
        setUserProfile(profile);
      } else {
        // Mock authentication for local/demo mode
        const uid = `usr-${email.replace(/[^a-zA-Z0-9]/g, '') || 'demo'}`;
        let profile = await getUserProfile(uid);
        if (!profile) {
          // If demo admin email
          const isAdmin = email.toLowerCase().includes('admin');
          profile = {
            uid,
            email,
            displayName: email.split('@')[0],
            role: isAdmin ? 'admin' : 'customer',
            isAdmin,
            createdAt: new Date().toISOString()
          };
          await saveUserProfile(profile);
        }
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(profile));
        setUserProfile(profile);
        setCurrentUser({ uid: profile.uid, email: profile.email, displayName: profile.displayName } as unknown as User);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name });
        const newProfile: UserProfile = {
          uid: userCredential.user.uid,
          email,
          displayName: name,
          role: 'customer',
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        await saveUserProfile(newProfile);
        setUserProfile(newProfile);
      } else {
        const uid = `usr-${Date.now()}`;
        const newProfile: UserProfile = {
          uid,
          email,
          displayName: name,
          role: 'customer',
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        await saveUserProfile(newProfile);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newProfile));
        setUserProfile(newProfile);
        setCurrentUser({ uid, email, displayName: name } as unknown as User);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await signInWithPopup(auth, googleProvider);
        let profile = await getUserProfile(userCredential.user.uid);
        if (!profile) {
          profile = {
            uid: userCredential.user.uid,
            email: userCredential.user.email || '',
            displayName: userCredential.user.displayName || 'Google User',
            photoURL: userCredential.user.photoURL || undefined,
            role: 'customer',
            isAdmin: false,
            createdAt: new Date().toISOString()
          };
          await saveUserProfile(profile);
        }
        setUserProfile(profile);
      } else {
        // Local fallback demo google user
        const uid = `google-demo-${Date.now()}`;
        const profile: UserProfile = {
          uid,
          email: 'customer@glimmergrace.com',
          displayName: 'Glimmer Customer',
          role: 'customer',
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        await saveUserProfile(profile);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(profile));
        setUserProfile(profile);
        setCurrentUser({ uid, email: profile.email, displayName: profile.displayName } as unknown as User);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      // In demo mode, acknowledge cleanly
      console.log(`Password reset link sent to: ${email}`);
    }
  };

  const grantAdminRole = async (secretKey?: string) => {
    if (!userProfile) {
      return { success: false, message: 'Must be logged in to claim administrator rights.' };
    }
    const result = await bootstrapAdmin(userProfile.uid, secretKey);
    if (result.success) {
      const refreshed = await getUserProfile(userProfile.uid);
      if (refreshed) {
        setUserProfile(refreshed);
        if (!isFirebaseConfigured) {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(refreshed));
        }
      }
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      isAdmin: Boolean(userProfile?.isAdmin || userProfile?.role === 'admin'),
      login,
      register,
      loginWithGoogle,
      logout,
      resetPassword,
      grantAdminRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
