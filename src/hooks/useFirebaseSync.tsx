import { useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface ProgressData {
  initialAmount: number;
  nTrades: number;
  l: number;
  m: number;
  t: number;
  f: number;
  totalResult: number;
  currentTrade: number;
  winBaseline: number;
  lossAccumulator: number;
  tradeCount: number;
  rows: any[];
  history: any[];
  redoStack: any[];
}

export const useFirebaseSync = () => {
  const { user } = useAuth();

  const saveProgress = useCallback(async (data: ProgressData) => {
    if (!user) return;

    try {
      // Exclude history and redoStack from Firebase saves
      const { history, redoStack, ...dataToSave } = data;
      await setDoc(doc(db, 'userProgress', user.uid), {
        ...dataToSave,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    }
  }, [user]);

  const loadProgress = useCallback(async (): Promise<ProgressData | null> => {
    if (!user) return null;

    try {
      const docRef = doc(db, 'userProgress', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as ProgressData;
      }
      return null;
    } catch (error) {
      console.error('Error loading progress:', error);
      toast.error('Failed to load progress');
      return null;
    }
  }, [user]);

  return { saveProgress, loadProgress };
};
