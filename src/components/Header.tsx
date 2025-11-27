import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, LogOut, Sparkles, HelpCircle, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ammcLogo from '@/assets/ammlogic-logo.png';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile Information
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img src={ammcLogo} alt="AMMLogic.Trade Logo" className="w-8 h-8" />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AMMLogic.Trade
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavLinks />
          {user && <ProfileDropdown />}
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
              <img src={ammcLogo} alt="AMMLogic.Trade Logo" className="w-8 h-8" />
              <span className="font-bold text-lg">AMMLogic.Trade</span>
            </div>
            <nav className="flex flex-col space-y-4">
              <NavLinks />
              {user && (
                <>
                  <Button variant="ghost" onClick={() => { navigate('/profile'); setOpen(false); }} className="justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profile Information
                  </Button>
                  <Button variant="ghost" onClick={() => { navigate('/dashboard'); setOpen(false); }} className="justify-start">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={signOut} className="justify-start text-destructive hover:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
