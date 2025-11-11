import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import HowItWorks from "./pages/HowItWorks";
import Upgrade from "./pages/Upgrade";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import CalculatorSettings from "./pages/admin/CalculatorSettings";
import PricingManagement from "./pages/admin/PricingManagement";
import LandingContent from "./pages/admin/LandingContent";
import FAQManagement from "./pages/admin/FAQManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import SubscriptionsManagement from "./pages/admin/SubscriptionsManagement";
import SiteSettings from "./pages/admin/SiteSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/how-it-works" element={<ProtectedRoute><HowItWorks /></ProtectedRoute>} />
            <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="calculator-settings" element={<CalculatorSettings />} />
              <Route path="pricing" element={<PricingManagement />} />
              <Route path="landing-content" element={<LandingContent />} />
              <Route path="faq" element={<FAQManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="subscriptions" element={<SubscriptionsManagement />} />
              <Route path="site-settings" element={<SiteSettings />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
