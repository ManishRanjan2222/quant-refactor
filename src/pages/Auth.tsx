import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import LandingHeader from '@/components/LandingHeader';
import Footer from '@/components/Footer';
import { CheckCircle2, Calculator, Cloud, Shield, Sparkles } from 'lucide-react';

const Auth = () => {
  const { user } = useAuth();
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
      name: 'Trial',
      price: '$1',
      duration: '1 month',
      features: [
        'Full calculator access',
        'Cloud sync',
        'Email support',
        'First-time users only',
      ],
      badge: 'FIRST TIME ONLY',
    },
    {
      name: 'Annual',
      price: '$50',
      duration: 'per year',
      features: [
        'Full calculator access',
        'Cloud sync',
        'Priority support',
        'Advanced analytics',
        'Export capabilities',
      ],
      popular: true,
    },
    {
      name: 'Lifetime',
      price: '$100',
      duration: 'one-time',
      features: [
        'Everything in Annual',
        'Lifetime access',
        'All future updates',
        'Dedicated support',
        'Early access to features',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LandingHeader
        onLoginClick={() => navigate('/login')}
        onHowItWorksClick={() => scrollToSection(howItWorksRef)}
        onPricingClick={() => scrollToSection(pricingRef)}
      />

      {/* Enhanced background with grid and orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(240_10%_15%/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(240_10%_15%/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Purple gradient orbs */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 via-primary-glow/20 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-accent/25 via-primary-glow/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-br from-primary-glow/20 to-transparent rounded-full blur-3xl animate-glow-pulse"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          {/* Promotional badge */}
          <div className="mb-8 animate-fade-in">
            <Badge className="bg-gradient-to-r from-primary via-primary-glow to-accent text-white border-0 px-6 py-2 text-sm font-semibold rounded-full shadow-lg shadow-primary/50">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Professional Trading Tools
            </Badge>
          </div>
          
          {/* Main headline - split across lines with gradient */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight animate-fade-in">
            <span className="block bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
              World's Most
            </span>
            <span className="block bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Powerful Trading
            </span>
            <span className="block bg-gradient-to-r from-accent via-primary-glow to-primary bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Make smarter trading decisions with advanced algorithms, real-time calculations, and comprehensive analytics
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => navigate('/login')}
              variant="aifiesta"
              size="xl"
              className="group"
            >
              Get Started Free
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Button>
            <Button
              onClick={() => scrollToSection(pricingRef)}
              variant="outline"
              size="xl"
              className="border-2"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-foreground">
            Why Choose AMMLogic.Trade?
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">
            Everything you need for professional trading
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 rounded-3xl">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">Smart Calculations</CardTitle>
                <CardDescription className="text-base">
                  Advanced algorithms for precise risk management and optimal position sizing
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 rounded-3xl">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-glow to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cloud className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">Cloud Sync</CardTitle>
                <CardDescription className="text-base">
                  Your data automatically synced across all devices in real-time
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 rounded-3xl">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">Bank-Level Security</CardTitle>
                <CardDescription className="text-base">
                  Enterprise-grade encryption and security for your sensitive trading data
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="relative z-10 py-20 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">
            Get started in three simple steps
          </p>
          <div className="space-y-8">
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Sign Up & Choose Your Plan</h3>
                <p className="text-muted-foreground text-lg">
                  Create your account with Google authentication and select the subscription plan that fits your trading needs.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-glow to-accent flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary-glow/30 group-hover:scale-110 transition-transform">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Input Your Parameters</h3>
                <p className="text-muted-foreground text-lg">
                  Enter your capital, risk percentage, entry and exit prices, and let AMMLogic.Trade calculate optimal position sizing.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Run Simulations & Analyze</h3>
                <p className="text-muted-foreground text-lg">
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
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-foreground">
            Choose Your Plan
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg">
            Select the perfect plan for your trading journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`group relative bg-white/5 backdrop-blur-xl border-2 hover:bg-white/10 transition-all duration-300 rounded-3xl overflow-hidden ${
                  plan.popular 
                    ? 'border-primary shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow-lg)] scale-105' 
                    : 'border-white/10 hover:border-primary/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-accent animate-glow-pulse"></div>
                )}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-primary via-primary-glow to-accent text-white border-0 px-6 py-2 text-sm font-bold rounded-full shadow-lg shadow-primary/50 animate-glow-pulse">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="space-y-4 pt-8">
                  <CardTitle className="text-3xl font-black">{plan.name}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div>
                      <span className="text-5xl font-black text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground text-lg">/{plan.duration}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-foreground/90 text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button
                    onClick={() => navigate('/login')}
                    variant={plan.popular ? 'aifiesta' : 'outline'}
                    size="lg"
                    className={`w-full text-base font-semibold ${
                      !plan.popular ? 'border-2 hover:border-primary' : ''
                    }`}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about AMMLogic.Trade
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 hover:bg-white/10 hover:border-primary/50 transition-all">
              <AccordionTrigger className="text-lg font-semibold text-left py-6">
                What is AMMLogic.Trade?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                AMMLogic.Trade is an advanced money management calculator designed for traders of all levels. It helps you calculate optimal position sizing, manage risk effectively, and simulate trading scenarios with professional-grade algorithms.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 hover:bg-white/10 hover:border-primary/50 transition-all">
              <AccordionTrigger className="text-lg font-semibold text-left py-6">
                How does the risk calculator work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                Our calculator uses your capital, risk percentage, entry and exit prices to determine the optimal position size. It factors in stop-loss levels and calculates your potential profit/loss to help you make informed trading decisions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 hover:bg-white/10 hover:border-primary/50 transition-all">
              <AccordionTrigger className="text-lg font-semibold text-left py-6">
                Can I use this for different markets?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                Yes! AMMLogic.Trade works for stocks, forex, crypto, and any other market where you need position sizing and risk management. The calculations are universal and adapt to your trading style.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 hover:bg-white/10 hover:border-primary/50 transition-all">
              <AccordionTrigger className="text-lg font-semibold text-left py-6">
                Is my data saved automatically?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                Yes, all your calculations and trades are automatically synced to the cloud in real-time. You can access your data from any device, and it's encrypted with bank-level security.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 hover:bg-white/10 hover:border-primary/50 transition-all">
              <AccordionTrigger className="text-lg font-semibold text-left py-6">
                What's included in the free plan?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                The free plan includes basic position sizing calculations and limited simulations. To unlock advanced features like unlimited calculations, detailed analytics, and export capabilities, upgrade to a paid plan.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 hover:bg-white/10 hover:border-primary/50 transition-all">
              <AccordionTrigger className="text-lg font-semibold text-left py-6">
                How do I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                You can cancel your subscription anytime from your account settings. Your access will continue until the end of your billing period, and you won't be charged again.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 hover:bg-white/10 hover:border-primary/50 transition-all">
              <AccordionTrigger className="text-lg font-semibold text-left py-6">
                Is there a mobile app?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                AMMLogic.Trade is a fully responsive web application that works perfectly on mobile browsers. You can access all features from your smartphone or tablet without downloading an app.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 hover:bg-white/10 hover:border-primary/50 transition-all">
              <AccordionTrigger className="text-lg font-semibold text-left py-6">
                Can I export my trade history?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                Yes, Professional and Enterprise plans include export capabilities. You can download your trade history and analytics in CSV or PDF format for your records.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Auth;
