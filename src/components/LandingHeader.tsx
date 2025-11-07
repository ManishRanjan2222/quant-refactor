import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import ammcLogo from '@/assets/ammlogic-logo.png';

interface LandingHeaderProps {
  onLoginClick: () => void;
  onHowItWorksClick: () => void;
  onPricingClick: () => void;
}

const LandingHeader = ({ onLoginClick, onHowItWorksClick, onPricingClick }: LandingHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Name - Left */}
        <div className="flex items-center gap-3">
          <img src={ammcLogo} alt="AMMLogic.Trade Logo" className="w-10 h-10" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            AMMLogic.Trade
          </span>
        </div>

        {/* Navigation Buttons - Right (Desktop) */}
        <nav className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onHowItWorksClick}
            className="text-foreground hover:text-primary"
          >
            How It Works
          </Button>
          <Button
            variant="ghost"
            onClick={onPricingClick}
            className="text-foreground hover:text-primary"
          >
            Pricing
          </Button>
          <Button
            onClick={onLoginClick}
            className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all"
          >
            Log In
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                onHowItWorksClick();
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start text-foreground hover:text-primary"
            >
              How It Works
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onPricingClick();
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start text-foreground hover:text-primary"
            >
              Pricing
            </Button>
            <Button
              onClick={() => {
                onLoginClick();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all"
            >
              Log In
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
