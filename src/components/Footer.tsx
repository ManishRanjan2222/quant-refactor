import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import ammcLogo from '@/assets/ammc-logo.png';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-background/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company/Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={ammcLogo} alt="AMMLogic.Trade Logo" className="w-10 h-10" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                AMMLogic.Trade
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Professional Trading Risk Management - Advanced Money Management Calculator for smart traders.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Calculator
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/upgrade" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:support@ammlogic.trade" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Email Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons Row */}
        <div className="flex justify-center gap-6 mb-8 pb-8 border-b border-white/10">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-110"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-110"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-110"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-110"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-110"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} AMMLogic.Trade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
