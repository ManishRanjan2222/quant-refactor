import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useTrialEligibility } from '@/hooks/useTrialEligibility';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CASHFREE_CONFIG } from '@/config/cashfree';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

declare global {
  interface Window {
    Cashfree: any;
  }
}

const Upgrade = () => {
  const { user } = useAuth();
  const { createSubscription, subscription } = useSubscription();
  const { hasUsedTrial, loading: trialLoading } = useTrialEligibility();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Trial',
      price: '$1',
      period: '1 month',
      duration: 1,
      amount: 100, // cents
      planId: 'trial',
      isTrialPlan: true,
      features: [
        'Full calculator access',
        'Cloud sync',
        'Email support',
        'First-time users only',
      ],
    },
    {
      name: 'Annual',
      price: '$50',
      period: 'per year',
      duration: 12,
      amount: 5000, // cents
      planId: 'annual',
      popular: true,
      features: [
        'Full calculator access',
        'Cloud sync',
        'Priority support',
        'Advanced analytics',
        'Export capabilities',
      ],
    },
    {
      name: 'Lifetime',
      price: '$100',
      period: 'one-time',
      duration: -1, // -1 = lifetime
      amount: 10000, // cents
      planId: 'lifetime',
      features: [
        'Everything in Annual',
        'Lifetime access',
        'All future updates',
        'Dedicated support',
        'Early access to features',
      ],
    },
  ];

  const planHierarchy: { [key: string]: number } = {
    'trial': 1,
    'annual': 2,
    'lifetime': 3,
  };

  const getCurrentPlanLevel = () => {
    if (!subscription?.isActive) return 0;
    return planHierarchy[subscription.planId] || 0;
  };

  const isPlanDisabled = (planId: string, isTrialPlan: boolean) => {
    // Disable trial if already used
    if (isTrialPlan && hasUsedTrial) return true;
    
    const currentLevel = getCurrentPlanLevel();
    const planLevel = planHierarchy[planId] || 0;
    return planLevel <= currentLevel;
  };

  const getButtonText = (planId: string, isTrialPlan: boolean) => {
    if (isTrialPlan && hasUsedTrial) return 'Trial Used';
    
    const currentLevel = getCurrentPlanLevel();
    const planLevel = planHierarchy[planId] || 0;
    
    if (planLevel === currentLevel) return 'Current Plan';
    if (planLevel < currentLevel) return 'Downgrade Not Available';
    return 'Subscribe Now';
  };

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    // Load Cashfree script if not already loaded
    if (!window.Cashfree) {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      script.onload = () => initiatePayment(plan);
      document.body.appendChild(script);
    } else {
      initiatePayment(plan);
    }
  };

  const initiatePayment = async (plan: typeof plans[0]) => {
    try {
      toast.loading('Creating payment session...');

      // Create Cashfree order directly
      const orderId = `order_${Date.now()}_${user!.uid.substring(0, 8)}`;
      const orderData = {
        order_id: orderId,
        order_amount: (plan.amount / 100).toFixed(2), // Convert cents to dollars
        order_currency: 'USD',
        customer_details: {
          customer_id: user!.uid,
          customer_email: user!.email,
          customer_phone: '0000000000', // Required by Cashfree
          customer_name: user!.displayName || user!.email?.split('@')[0] || 'User',
        },
        order_meta: {
          return_url: `${window.location.origin}/upgrade?status=success`,
          notify_url: `${window.location.origin}/api/cashfree-webhook`,
        },
        order_note: `${plan.name} Plan - ${plan.period}`,
      };

      const response = await fetch(CASHFREE_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-version': CASHFREE_CONFIG.apiVersion,
          'x-client-id': CASHFREE_CONFIG.appId,
          'x-client-secret': CASHFREE_CONFIG.secretKey,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Check for CORS error
        if (response.type === 'cors' || response.status === 0) {
          throw new Error('CORS_ERROR: Unable to connect to payment gateway. Please contact support.');
        }
        
        throw new Error(errorData.message || `Payment setup failed (${response.status})`);
      }

      const data = await response.json();
      toast.dismiss();

      // Initialize Cashfree checkout
      const cashfree = window.Cashfree({ mode: CASHFREE_CONFIG.environment });
      
      const checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        returnUrl: `${window.location.origin}/upgrade?status=success`,
      };

      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          toast.error('Payment failed: ' + result.error.message);
          
          // Log failed transaction
          await addDoc(collection(db, 'transactions'), {
            userId: user!.uid,
            userEmail: user!.email,
            planId: plan.planId,
            planName: plan.name,
            amount: plan.amount,
            currency: 'USD',
            cashfreeOrderId: data.order_id || orderId,
            status: 'failed',
            createdAt: new Date(),
          });
        } else if (result.paymentDetails) {
          // Payment successful
          try {
            // Save subscription
            await createSubscription(
              plan.planId,
              plan.name,
              plan.duration,
              data.order_id || orderId
            );

            // Log successful transaction
            await addDoc(collection(db, 'transactions'), {
              userId: user!.uid,
              userEmail: user!.email,
              planId: plan.planId,
              planName: plan.name,
              amount: plan.amount,
              currency: 'USD',
              cashfreeOrderId: data.order_id || orderId,
              status: 'success',
              createdAt: new Date(),
            });

            toast.success('Payment successful! Your subscription is now active.');
            setTimeout(() => {
              navigate('/');
            }, 2000);
          } catch (error) {
            console.error('Error saving subscription:', error);
            toast.error('Payment received but failed to activate subscription. Please contact support.');
          }
        }
      });

    } catch (error: any) {
      console.error('Error creating payment:', error);
      toast.dismiss();
      
      // Handle CORS errors specifically
      if (error.message?.includes('CORS_ERROR')) {
        toast.error('Payment gateway connection blocked. Please contact support at support@ammlogic.trade', {
          duration: 6000,
        });
      } else {
        toast.error(error.message || 'Failed to create payment session. Please try again.');
      }
    }
  };

  if (trialLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading plans...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Upgrade Your Plan
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your trading needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.planId} 
                className={`bg-card/50 backdrop-blur-xl ${plan.popular ? 'border-primary shadow-[var(--shadow-glow)] scale-105' : 'border-border'}`}
              >
                <CardHeader>
                  {plan.popular && (
                    <Badge className="inline-block w-fit px-3 py-1 mb-4 text-xs font-semibold bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-full">
                      MOST POPULAR
                    </Badge>
                  )}
                  {plan.isTrialPlan && (
                    <Badge className="inline-block w-fit px-3 py-1 mb-4 text-xs font-semibold bg-gradient-to-r from-accent to-primary text-primary-foreground rounded-full">
                      FIRST TIME ONLY
                    </Badge>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground"> / {plan.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isPlanDisabled(plan.planId, plan.isTrialPlan || false)}
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)]' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {getButtonText(plan.planId, plan.isTrialPlan || false)}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>All plans are secured with Cashfree payment processing</p>
            <p className="mt-2">Need a custom plan? Contact us at support@ammlogic.trade</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Upgrade;
