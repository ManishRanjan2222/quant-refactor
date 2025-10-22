import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Sparkles, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link to="/how-it-works" onClick={() => setOpen(false)}>
        <Button variant="ghost">
          <HelpCircle className="mr-2 h-4 w-4" />
          How It Works
        </Button>
      </Link>
      <Link to="/upgrade" onClick={() => setOpen(false)}>
        <Button variant="ghost">
          <Sparkles className="mr-2 h-4 w-4" />
          Upgrade
        </Button>
      </Link>
      {user && (
        <Button variant="ghost" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">Trading Calculator</span>
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
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4 mt-8">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
