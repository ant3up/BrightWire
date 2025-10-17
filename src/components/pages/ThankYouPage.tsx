import { CheckCircle, Phone, Home, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ThankYouPageProps {
  onNavigate: (page: string) => void;
}

export function ThankYouPage({ onNavigate }: ThankYouPageProps) {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F5F7F8]">
      <div className="max-w-[800px] mx-auto px-6 lg:px-8">
        <div className="text-center py-12">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-[#FFCC00]" />
          </div>

          {/* Main Message */}
          <h1 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
            Thank You!
          </h1>
          <p className="text-gray-600 mb-8" style={{ fontSize: '1.25rem', lineHeight: 1.6 }}>
            We've received your request and will be in touch within 1 business hour.
          </p>

          {/* Confirmation Card */}
          <Card className="p-8 text-left bg-white border border-gray-200 shadow-lg mb-8">
            <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 600, fontSize: '1.5rem' }}>
              What Happens Next?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#FFCC00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1E2A31]" style={{ fontWeight: 700, fontSize: '0.875rem' }}>1</span>
                </div>
                <div>
                  <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600 }}>
                    We Review Your Request
                  </h3>
                  <p className="text-gray-600">
                    Our team will review your details and assess the best way to help you.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#FFCC00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1E2A31]" style={{ fontWeight: 700, fontSize: '0.875rem' }}>2</span>
                </div>
                <div>
                  <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600 }}>
                    We'll Call You
                  </h3>
                  <p className="text-gray-600">
                    Expect a call within 1 business hour to discuss your needs and provide a quote.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-[#FFCC00] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1E2A31]" style={{ fontWeight: 700, fontSize: '0.875rem' }}>3</span>
                </div>
                <div>
                  <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600 }}>
                    We Schedule Your Service
                  </h3>
                  <p className="text-gray-600">
                    Once you approve the quote, we'll book a convenient time for your service.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Notice */}
          <Card className="p-6 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] text-white border-none shadow-lg mb-8">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-[#FFCC00] flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="text-white mb-2" style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  Need Immediate Help?
                </h3>
                <p className="text-blue-100 mb-3" style={{ fontSize: '0.9375rem' }}>
                  If this is an emergency (power outage, sparking, electrical hazard), please call us immediately instead of waiting.
                </p>
                <Button
                  size="lg"
                  className="bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800]"
                  asChild
                >
                  <a href="tel:0400000000" className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Emergency: 0400 000 000
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('home')}
              size="lg"
              variant="outline"
              className="border-[#0B4A6F] text-[#0B4A6F] hover:bg-[#0B4A6F] hover:text-white"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={() => onNavigate('services')}
              size="lg"
              variant="outline"
              className="border-[#0B4A6F] text-[#0B4A6F] hover:bg-[#0B4A6F] hover:text-white"
            >
              View Our Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>
              You should receive a confirmation email shortly. If you don't hear from us within 1 business hour,
              please call <a href="tel:0400000000" className="text-[#0B4A6F] hover:underline" style={{ fontWeight: 600 }}>0400 000 000</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
