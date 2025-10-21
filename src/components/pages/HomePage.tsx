import { Shield, Clock, Star, CheckCircle, Zap, AlertCircle, Settings, Lightbulb, Wrench, ClipboardCheck, Calendar, ArrowRight, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { ServiceCard } from '../ServiceCard';
import { TestimonialCard } from '../TestimonialCard';
import { PricingCard } from '../PricingCard';
import { TrustBadge } from '../TrustBadge';
import { ProcessStep } from '../ProcessStep';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { COMPANY_INFO } from '../../config/constants';
import heroImage from 'figma:asset/7295574c342e62f45a1471b09ce33d1d41d2db38.png';
import whyChooseImage from 'figma:asset/e86154c444a0f3e6be74da06bb873d2bd0b48f4a.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onServiceSelect: (serviceId: string) => void;
}

export function HomePage({ onNavigate, onServiceSelect }: HomePageProps) {
  const services = [
    {
      id: 'emergency',
      icon: AlertCircle,
      title: 'Emergency Callouts',
      description: 'Power outage? Our emergency team will be there fast to diagnose and restore power safely.',
      priceGuide: 'From $150 callout fee',
    },
    {
      id: 'switchboard',
      icon: Settings,
      title: 'Switchboard Upgrades',
      description: 'Modern, safe switchboards with RCD protection for your home or business.',
      priceGuide: 'From $800',
    },
    {
      id: 'rewiring',
      icon: Zap,
      title: 'Home Rewiring',
      description: 'Complete or partial rewiring services for older homes needing electrical updates.',
      priceGuide: 'Call for quote',
    },
    {
      id: 'lighting',
      icon: Lightbulb,
      title: 'LED Lighting',
      description: 'Energy-efficient LED installations for indoor and outdoor spaces.',
      priceGuide: 'From $95 per fitting',
    },
    {
      id: 'inspections',
      icon: ClipboardCheck,
      title: 'Safety Inspections',
      description: 'Comprehensive electrical safety checks with detailed compliance reports.',
      priceGuide: 'From $200',
    },
    {
      id: 'commercial',
      icon: Wrench,
      title: 'Commercial Work',
      description: 'Professional electrical services for offices, retail, and small businesses.',
      priceGuide: 'Call for quote',
    },
  ];

  const testimonials = [
    {
      rating: 5,
      quote: 'Replaced our switchboard in under 3 hours. Professional and tidy. Highly recommend!',
      name: 'Sarah',
      suburb: 'Newtown',
    },
    {
      rating: 5,
      quote: 'Called them for an emergency at 9pm. They arrived within 45 minutes and fixed everything.',
      name: 'Michael',
      suburb: 'Bondi',
    },
    {
      rating: 5,
      quote: 'Great communication, transparent pricing, and excellent work. Will use them again.',
      name: 'Lisa',
      suburb: 'Parramatta',
    },
  ];

  const pricingTiers = [
    {
      title: 'Safety Inspection',
      description: 'Perfect for home buyers or annual checks',
      price: '$200',
      features: [
        'Full electrical audit',
        'Detailed compliance report',
        'Safety recommendations',
        'Certificate of compliance',
        'Same-day booking available',
      ],
    },
    {
      title: 'Emergency Callout',
      description: '24/7 fast response service',
      price: '$150',
      features: [
        'Available 24/7',
        'Fast response time',
        '1-hour arrival (metro)',
        'Fully equipped van',
        'Upfront pricing',
      ],
      highlighted: true,
    },
    {
      title: 'LED Upgrade',
      description: 'Switch to energy-efficient lighting',
      price: '$95/fitting',
      features: [
        'High-quality LED fittings',
        '5-year warranty',
        'Professional installation',
        'Energy savings report',
        'Bulk discounts available',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B4A6F] to-[#09324D] text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-white mb-6" style={{ fontWeight: 700, fontSize: '3rem', lineHeight: 1.1 }}>
                Fast, licensed electricians in Sydney — available 24/7
              </h1>
              <p className="text-blue-100 mb-8" style={{ fontSize: '1.25rem', lineHeight: 1.5 }}>
                Emergency callouts, installations & safety checks. Same-day bookings available.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  onClick={() => onNavigate('booking')}
                  size="lg"
                  className="bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800] shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{ fontSize: '1.125rem', fontWeight: 600 }}
                >
                  Get a Free Quote
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-[#0B4A6F] transition-all duration-200"
                  asChild
                >
                  <a href={COMPANY_INFO.phone.href} className="flex items-center justify-center gap-2 text-white hover:text-[#0B4A6F] transition-colors duration-200">
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold text-white">Call Now — {COMPANY_INFO.phone.display}</span>
                  </a>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3">
                <TrustBadge icon={Shield} text="Licensed & Insured" />
                <TrustBadge icon={Clock} text="Same-day callouts" />
                <TrustBadge icon={CheckCircle} text="Transparent pricing" />
                <TrustBadge icon={Star} text="5★ Reviews" />
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Licensed electrician working on switchboard"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#FFCC00] rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#0B4A6F]" />
                    </div>
                    <div>
                      <p className="text-[#1E2A31]" style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                        24/7 Emergency Service
                      </p>
                      <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                        Fast response across Sydney
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-[#F5F7F8]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Simple, fast, and hassle-free electrical services in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <ProcessStep
              number={1}
              icon={Calendar}
              title="Book Online"
              description="Choose a time that suits you or call for same-day emergency service"
            />
            <ProcessStep
              number={2}
              icon={Zap}
              title="We Arrive"
              description="Our licensed electrician arrives on time with all necessary equipment"
            />
            <ProcessStep
              number={3}
              icon={CheckCircle}
              title="Fix & Invoice"
              description="We complete the job, clean up, and provide transparent invoicing"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Professional electrical solutions for homes and businesses across Sydney
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                priceGuide={service.priceGuide}
                onLearnMore={() => onServiceSelect(service.id)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => onNavigate('services')}
              size="lg"
              variant="outline"
              className="border-[#0B4A6F] text-[#0B4A6F] hover:bg-[#0B4A6F] hover:text-white"
            >
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#F5F7F8]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[#1E2A31] mb-6" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
                Why Choose BrightWire?
              </h2>
              <p className="text-gray-600 mb-8" style={{ fontSize: '1.125rem' }}>
                We're Sydney's trusted electrical experts, committed to safety, quality, and customer satisfaction.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Licensed & Insured', description: 'Fully licensed electricians with comprehensive insurance coverage' },
                  { icon: Clock, title: 'Same-Day Service', description: 'Emergency callouts and same-day bookings available across Sydney' },
                  { icon: CheckCircle, title: 'Transparent Pricing', description: 'Upfront quotes with no hidden fees or surprise charges' },
                  { icon: Star, title: '5-Star Reviews', description: 'Hundreds of happy customers across Sydney suburbs' },
                  { icon: Zap, title: '100% Safety Checks', description: 'Every job includes thorough safety testing and compliance checks' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-[#FFCC00]" />
                    </div>
                    <div>
                      <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={whyChooseImage}
                  alt="Professional electrician installing ceiling lighting"
                  className="w-full h-[600px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Don't just take our word for it — hear from our satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="py-20 bg-[#F5F7F8]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
              Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              No hidden fees. No surprises. Just honest, upfront pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <PricingCard
                key={index}
                {...tier}
                onBookNow={() => onNavigate('booking')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] text-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
            Need an Electrician Today?
          </h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto" style={{ fontSize: '1.25rem' }}>
            Same-day bookings available. Emergency service 24/7. Get your free quote now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('booking')}
              size="lg"
              className="bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800] shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ fontSize: '1.125rem', fontWeight: 600 }}
            >
              Get a Free Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-[#0B4A6F] transition-all duration-200"
              asChild
            >
              <a href={COMPANY_INFO.phone.href} className="flex items-center gap-2 text-white hover:text-[#0B4A6F] transition-colors duration-200">
                <Phone className="w-5 h-5" />
                <span className="font-semibold text-white">Call Now — {COMPANY_INFO.phone.display}</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
