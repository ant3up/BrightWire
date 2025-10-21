import { useState, useEffect } from 'react';
import { Menu, X, Phone, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { COMPANY_INFO } from '../config/constants';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'nav-home', label: 'Home', page: 'home' },
    { id: 'nav-services', label: 'Services', page: 'services' },
    { id: 'nav-about', label: 'About', page: 'about' },
    { id: 'nav-pricing', label: 'Pricing', page: 'services' },
    { id: 'nav-contact', label: 'Contact', page: 'booking' },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#FFCC00]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[#0B4A6F]" style={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2 }}>
                BrightWire
              </span>
              <span className="text-[#6B7280]" style={{ fontSize: '0.75rem', lineHeight: 1 }}>
                Electrical
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.page)}
                className={`transition-colors hover:text-[#0B4A6F] ${
                  currentPage === item.page ? 'text-[#0B4A6F]' : 'text-[#1E2A31]'
                }`}
                style={{ fontWeight: currentPage === item.page ? 600 : 400 }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a href={COMPANY_INFO.phone.href} className="flex items-center gap-2 text-[#0B4A6F] hover:text-[#09324D] transition-colors">
              <Phone className="w-4 h-4" />
              <span style={{ fontWeight: 600 }}>{COMPANY_INFO.phone.display}</span>
            </a>
            <Button
              onClick={() => handleNavClick('booking')}
              className="bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800] shadow-md"
            >
              Get a Free Quote
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.page)}
                    className={`text-left transition-colors hover:text-[#0B4A6F] ${
                      currentPage === item.page ? 'text-[#0B4A6F]' : 'text-[#1E2A31]'
                    }`}
                    style={{ fontSize: '1.125rem', fontWeight: currentPage === item.page ? 600 : 400 }}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-6 border-t border-gray-200 flex flex-col gap-4">
                  <a
                    href={COMPANY_INFO.phone.href}
                    className="flex items-center gap-2 text-[#0B4A6F] hover:text-[#09324D] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span style={{ fontWeight: 600 }}>{COMPANY_INFO.phone.display}</span>
                  </a>
                  <Button
                    onClick={() => handleNavClick('booking')}
                    className="bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800] w-full"
                  >
                    Get a Free Quote
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
