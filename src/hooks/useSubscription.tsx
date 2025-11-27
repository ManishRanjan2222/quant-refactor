import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from './useAuth';

export interface Subscription {
  planId: string;
  planName: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isLifetime: boolean;
  cashfreeOrderId?: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const subDoc = await getDoc(doc(db, 'subscriptions', user.uid));
        if (subDoc.exists()) {
          const data = subDoc.data();
          const isLifetime = data.isLifetime || false;
          const endDate = data.endDate ? data.endDate.toDate() : new Date();
          const isActive = isLifetime || endDate > new Date();
          
          setSubscription({
            planId: data.planId,
            planName: data.planName,
            startDate: data.startDate.toDate(),
            endDate,
            isActive,
            isLifetime,
            cashfreeOrderId: data.cashfreeOrderId,
          });
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const createSubscription = async (
    planId: string,
    planName: string,
    durationMonths: number,
    cashfreeOrderId: string
  ) => {
    if (!user) return;

    const startDate = new Date();
    const isLifetime = durationMonths === -1;
    const endDate = new Date();
    
    if (!isLifetime) {
      endDate.setMonth(endDate.getMonth() + durationMonths);
    } else {
      // Set far future date for lifetime
      endDate.setFullYear(endDate.getFullYear() + 100);
    }

    const subData = {
      planId,
      planName,
      startDate,
      endDate,
      isLifetime,
      cashfreeOrderId,
      userId: user.uid,
      userEmail: user.email,
    };

    await setDoc(doc(db, 'subscriptions', user.uid), subData);
    
    setSubscription({
      planId,
      planName,
      startDate,
      endDate,
      isActive: true,
      isLifetime,
      cashfreeOrderId,
    });
  };

  const checkSubscription = () => {
    if (!subscription) return false;
    if (subscription.isLifetime) return true;
    return subscription.isActive && subscription.endDate > new Date();
  };

  return {
    subscription,
    loading,
    hasActiveSubscription: checkSubscription(),
    createSubscription,
  };
};
