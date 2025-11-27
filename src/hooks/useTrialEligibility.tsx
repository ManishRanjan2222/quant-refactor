import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './useAuth';

export const useTrialEligibility = () => {
  const { user } = useAuth();
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasUsedTrial(false);
      setLoading(false);
      return;
    }

    const checkTrialUsage = async () => {
      try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(
          transactionsRef,
          where('userId', '==', user.uid),
          where('planId', '==', 'trial'),
          where('status', '==', 'success')
        );

        const querySnapshot = await getDocs(q);
        setHasUsedTrial(!querySnapshot.empty);
      } catch (error) {
        console.error('Error checking trial eligibility:', error);
        setHasUsedTrial(false);
      } finally {
        setLoading(false);
      }
    };

    checkTrialUsage();
  }, [user]);

  return {
    hasUsedTrial,
    loading,
  };
};
