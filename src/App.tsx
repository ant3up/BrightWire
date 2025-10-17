import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingCallButton } from './components/FloatingCallButton';
import { HomePage } from './components/pages/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { AboutPage } from './components/pages/AboutPage';
import { BookingPage } from './components/pages/BookingPage';
import { FAQPage } from './components/pages/FAQPage';
import { ThankYouPage } from './components/pages/ThankYouPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  // Handle hash-based routing for better UX
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setCurrentPage(hash);
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedService(undefined);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentPage('services');
    window.location.hash = 'services';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main>
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} onServiceSelect={handleServiceSelect} />
        )}
        {currentPage === 'services' && (
          <ServicesPage onNavigate={handleNavigate} selectedService={selectedService} />
        )}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'booking' && <BookingPage onNavigate={handleNavigate} />}
        {currentPage === 'faq' && <FAQPage onNavigate={handleNavigate} />}
        {currentPage === 'thankyou' && <ThankYouPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
      <FloatingCallButton />
      <Toaster />
    </div>
  );
}
