import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Upgrade = () => {
  const { user } = useAuth();

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
      key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
      amount: plan.razorpayAmount,
      currency: 'INR',
      name: 'Trading Calculator',
      description: `${plan.name} Plan Subscription`,
      image: '/favicon.ico',
      handler: function (response: any) {
        toast.success('Payment successful! Your plan has been upgraded.');
        console.log('Payment ID:', response.razorpay_payment_id);
        // Here you would typically save the subscription to Firebase
      },
      prefill: {
        email: user?.email || '',
        contact: '',
      },
      theme: {
        color: '#3b82f6',
      },
      modal: {
        ondismiss: function() {
          toast.info('Payment cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your trading needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.planId} className={plan.popular ? 'border-primary shadow-lg' : ''}>
              <CardHeader>
                {plan.popular && (
                  <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
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
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  Subscribe Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All plans include a 7-day money-back guarantee</p>
          <p className="mt-2">Need a custom plan? Contact us at support@tradingcalculator.com</p>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
