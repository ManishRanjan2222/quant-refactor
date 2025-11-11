import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email already in use';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    default:
      return 'Authentication failed. Please try again';
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Check if user is admin
        const userRoleDoc = await getDoc(doc(db, 'user_roles', user.uid));
        const adminStatus = userRoleDoc.exists() && userRoleDoc.data()?.isAdmin === true;
        setIsAdmin(adminStatus);
        
        // Redirect based on admin status
        const currentPath = window.location.pathname;
        if (adminStatus && (currentPath === '/auth' || currentPath === '/login')) {
          navigate('/admin');
        } else if (!adminStatus && currentPath.startsWith('/admin')) {
          navigate('/');
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      const message = getAuthErrorMessage(error.code);
      toast.error(message);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name?: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      if (name && name.trim()) {
        await updateProfile(user, { displayName: name.trim() });
      }
      
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      const message = getAuthErrorMessage(error.code);
      toast.error(message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      toast.success('Password reset email sent!');
    } catch (error: any) {
      const message = getAuthErrorMessage(error.code);
      toast.error(message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success('Signed out successfully!');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signInWithEmail, signUpWithEmail, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
