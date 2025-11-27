import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserProfile {
  name: string;
  phone: string;
  language: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'userProfiles', user.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setProfile({
            name: data.name || '',
            phone: data.phone || '',
            language: data.language || 'English',
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          });
        } else {
          // Initialize with default values
          setProfile({
            name: user.displayName || '',
            phone: '',
            language: 'English',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return false;

    try {
      const profileRef = doc(db, 'userProfiles', user.uid);
      const profileDoc = await getDoc(profileRef);

      const updateData = {
        ...data,
        updatedAt: new Date(),
        ...(profileDoc.exists() ? {} : { createdAt: new Date() }),
      };

      await setDoc(profileRef, updateData, { merge: true });
      
      setProfile(prev => prev ? { ...prev, ...data, updatedAt: new Date() } : null);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
  };
};
