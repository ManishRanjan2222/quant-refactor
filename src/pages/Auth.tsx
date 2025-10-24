import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ammcLogo from '@/assets/ammc-logo.png';

const Auth = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Logo and branding */}
        <div className="text-center mb-12 animate-fade-in">
          <img src={ammcLogo} alt="AMMC Logo" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            AMMC
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            Advanced Money Management Calculator
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Professional trading calculator for risk management and position sizing
          </p>
        </div>

        {/* Sign in card */}
        <div className="w-full max-w-md">
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
            <h2 className="text-2xl font-semibold mb-2 text-center text-foreground">Get Started</h2>
            <p className="text-muted-foreground text-center mb-8">
              Sign in to access your trading dashboard
            </p>
            
            <Button 
              onClick={signIn} 
              className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all duration-300"
              size="lg"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="text-center p-6 bg-card/30 backdrop-blur rounded-xl border border-border">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold mb-2">Smart Calculations</h3>
            <p className="text-sm text-muted-foreground">Advanced algorithms for precise risk management</p>
          </div>
          <div className="text-center p-6 bg-card/30 backdrop-blur rounded-xl border border-border">
            <div className="text-3xl mb-2">💾</div>
            <h3 className="font-semibold mb-2">Cloud Sync</h3>
            <p className="text-sm text-muted-foreground">Your data synced across all devices</p>
          </div>
          <div className="text-center p-6 bg-card/30 backdrop-blur rounded-xl border border-border">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-muted-foreground">Bank-level security for your data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
