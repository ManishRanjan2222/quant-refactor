import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Upgrade = () => {
  const { user } = useAuth();
  const { createSubscription, subscription } = useSubscription();
  const navigate = useNavigate();

  // Define plan hierarchy for comparison
  const planHierarchy: { [key: string]: number } = {
    'basic': 1,
    'professional': 2,
    'enterprise': 3
  };

  const getCurrentPlanLevel = () => {
    if (!subscription?.isActive) return 0;
    return planHierarchy[subscription.planId] || 0;
  };

  const isPlanDisabled = (planId: string) => {
    const currentLevel = getCurrentPlanLevel();
    const planLevel = planHierarchy[planId] || 0;
    return planLevel <= currentLevel;
  };

  const plans = [
    {
      name: 'Basic',
      price: '₹999',
      period: '/month',
      features: [
        'Up to 100 trades per month',
        'Basic analytics',
        'Email support',
        'Cloud storage',
      ],
      razorpayAmount: 99900, // in paise
      planId: 'basic'
    },
    {
      name: 'Professional',
      price: '₹2,999',
      period: '/month',
      features: [
        'Unlimited trades',
        'Advanced analytics',
        'Priority support',
        'Cloud storage',
        'Custom reports',
        'API access',
      ],
      razorpayAmount: 299900,
      planId: 'professional',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '₹9,999',
      period: '/month',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'Team collaboration',
        'Advanced security',
      ],
      razorpayAmount: 999900,
      planId: 'enterprise'
    }
  ];

  const handleUpgrade = (plan: typeof plans[0]) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => initiatePayment(plan);
      document.body.appendChild(script);
    } else {
      initiatePayment(plan);
    }
  };

  const initiatePayment = (plan: typeof plans[0]) => {
    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Test key from uploaded file
      amount: plan.razorpayAmount,
      currency: 'INR',
      name: 'AMMC',
      description: `${plan.name} Plan Subscription`,
      image: '/favicon.ico',
      handler: async function (response: any) {
        try {
          // Save subscription to Firebase
          await createSubscription(
            plan.planId,
            plan.name,
            1, // 1 month duration
            response.razorpay_payment_id
          );
          
          toast.success('Payment successful! Your subscription is now active.');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } catch (error) {
          console.error('Error saving subscription:', error);
          toast.error('Payment received but failed to activate subscription. Please contact support.');
        }
      },
      prefill: {
        email: user?.email || '',
        name: user?.displayName || '',
      },
      theme: {
        color: '#3b82f6',
      },
      modal: {
        ondismiss: function() {
          toast.info('Payment cancelled');
        },
        confirm_close: true
      }
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        toast.error('Payment failed: ' + response.error.description);
      });
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      toast.error('Failed to open payment gateway. Please try again.');
    }
  };

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
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
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
                    disabled={isPlanDisabled(plan.planId)}
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)]' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {isPlanDisabled(plan.planId) ? 'Current Plan' : 'Subscribe Now'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>All plans include a 7-day money-back guarantee</p>
            <p className="mt-2">Need a custom plan? Contact us at support@ammc.app</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upgrade;
