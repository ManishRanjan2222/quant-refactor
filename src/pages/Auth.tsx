import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import LandingHeader from '@/components/LandingHeader';
import { CheckCircle2 } from 'lucide-react';

const Auth = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const howItWorksRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const plans = [
    {
      name: 'Basic',
      price: '₹199',
      duration: '1 month',
      features: [
        'Advanced risk calculator',
        'Position sizing tools',
        'Basic analytics',
        'Cloud sync',
        'Mobile access',
      ],
    },
    {
      name: 'Professional',
      price: '₹499',
      duration: '3 months',
      features: [
        'Everything in Basic',
        'Advanced simulation',
        'Detailed trade history',
        'Export capabilities',
        'Priority support',
        'Custom strategies',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '₹899',
      duration: '6 months',
      features: [
        'Everything in Professional',
        'Unlimited calculations',
        'API access',
        'White-label options',
        'Dedicated support',
        'Advanced analytics',
        'Team collaboration',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <LandingHeader
        onLoginClick={signIn}
        onHowItWorksClick={() => scrollToSection(howItWorksRef)}
        onPricingClick={() => scrollToSection(pricingRef)}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-fade-in">
            Advanced Money Management Calculator
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in">
            Professional trading calculator for precise risk management and position sizing
          </p>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in">
            Make smarter trading decisions with advanced algorithms, real-time calculations, and comprehensive analytics
          </p>
          <Button
            onClick={signIn}
            size="lg"
            className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all animate-scale-in"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose AMMC?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-xl border-border hover:shadow-[var(--shadow-card)] transition-all">
              <CardHeader>
                <div className="text-5xl mb-4">📊</div>
                <CardTitle>Smart Calculations</CardTitle>
                <CardDescription>
                  Advanced algorithms for precise risk management and optimal position sizing
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card/50 backdrop-blur-xl border-border hover:shadow-[var(--shadow-card)] transition-all">
              <CardHeader>
                <div className="text-5xl mb-4">💾</div>
                <CardTitle>Cloud Sync</CardTitle>
                <CardDescription>
                  Your data automatically synced across all devices in real-time
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card/50 backdrop-blur-xl border-border hover:shadow-[var(--shadow-card)] transition-all">
              <CardHeader>
                <div className="text-5xl mb-4">🔒</div>
                <CardTitle>Bank-Level Security</CardTitle>
                <CardDescription>
                  Enterprise-grade encryption and security for your sensitive trading data
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="relative z-10 py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Sign Up & Choose Your Plan</h3>
                <p className="text-muted-foreground">
                  Create your account with Google authentication and select the subscription plan that fits your trading needs.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Input Your Parameters</h3>
                <p className="text-muted-foreground">
                  Enter your capital, risk percentage, entry and exit prices, and let AMMC calculate optimal position sizing.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Run Simulations & Analyze</h3>
                <p className="text-muted-foreground">
                  Simulate multiple trades, track your performance, and make data-driven decisions with comprehensive analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Choose Your Plan
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Select the perfect plan for your trading journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative bg-card/50 backdrop-blur-xl border-border hover:shadow-[var(--shadow-card)] transition-all ${
                  plan.popular ? 'border-primary shadow-[var(--shadow-glow)]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.duration}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={signIn}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)]'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AMMC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
