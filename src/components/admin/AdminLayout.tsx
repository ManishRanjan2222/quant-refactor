import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Calculator, 
  DollarSign, 
  Home, 
  HelpCircle, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/admin/calculator-settings', label: 'Calculator Settings', icon: Calculator },
    { path: '/admin/pricing', label: 'Pricing Plans', icon: DollarSign },
    { path: '/admin/landing-content', label: 'Landing Content', icon: Home },
    { path: '/admin/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/subscriptions', label: 'Subscriptions', icon: Calendar },
    { path: '/admin/site-settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B0050] to-[#6E2AA9] flex">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white/5 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col`}
      >
        {/* Logo & Toggle */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img src="/src/assets/ammlogic-logo.png" alt="AMMLogic" className="w-8 h-8" />
              <div>
                <h1 className="text-white font-bold text-lg">AMMLogic</h1>
                <p className="text-[#FF2D95] text-xs font-semibold">ADMIN PANEL</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#FF2D95] text-white shadow-lg shadow-[#FF2D95]/50'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-center text-sm font-bold">
                ADMIN
              </div>
              <div className="text-white/70 text-sm truncate">{user?.email}</div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="icon"
              className="w-full text-white hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
