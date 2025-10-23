import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Sparkles, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ammcLogo from '@/assets/ammc-logo.png';

const Header = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link to="/how-it-works" onClick={() => setOpen(false)}>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          <HelpCircle className="mr-2 h-4 w-4" />
          How It Works
        </Button>
      </Link>
      <Link to="/upgrade" onClick={() => setOpen(false)}>
        <Button variant="ghost" className="text-foreground hover:text-primary">
          <Sparkles className="mr-2 h-4 w-4" />
          Upgrade
        </Button>
      </Link>
      {user && (
        <Button variant="ghost" onClick={signOut} className="text-foreground hover:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img src={ammcLogo} alt="AMMC Logo" className="w-8 h-8" />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AMMC
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavLinks />
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-card border-border">
            <div className="flex items-center space-x-3 mb-8">
              <img src={ammcLogo} alt="AMMC Logo" className="w-8 h-8" />
              <span className="font-bold text-lg">AMMC</span>
            </div>
            <nav className="flex flex-col space-y-4">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
