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
  razorpayPaymentId?: string;
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
          const endDate = data.endDate.toDate();
          const isActive = endDate > new Date();
          
          setSubscription({
            planId: data.planId,
            planName: data.planName,
            startDate: data.startDate.toDate(),
            endDate,
            isActive,
            razorpayPaymentId: data.razorpayPaymentId,
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
    razorpayPaymentId: string
  ) => {
    if (!user) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);

    const subData = {
      planId,
      planName,
      startDate,
      endDate,
      razorpayPaymentId,
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
      razorpayPaymentId,
    });
  };

  const checkSubscription = () => {
    if (!subscription) return false;
    return subscription.isActive && subscription.endDate > new Date();
  };

  return {
    subscription,
    loading,
    hasActiveSubscription: checkSubscription(),
    createSubscription,
  };
};
