import { AlertCircle, Settings, Zap, Lightbulb, ClipboardCheck, Wrench, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ServiceCard } from '../ServiceCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import switchboardImage from 'figma:asset/7295574c342e62f45a1471b09ce33d1d41d2db38.png';
import ceilingWorkImage from 'figma:asset/e86154c444a0f3e6be74da06bb873d2bd0b48f4a.png';
import wiringImage from 'figma:asset/d9d9edd909914a0f5d37d5ffebb8245f55567c6d.png';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
  selectedService?: string;
}

export function ServicesPage({ onNavigate, selectedService }: ServicesPageProps) {
  const [activeService, setActiveService] = useState<string | null>(selectedService || null);

  const services = [
    {
      id: 'emergency',
      icon: AlertCircle,
      title: 'Emergency Callouts',
      description: 'Power outage? Our emergency team will be there fast to diagnose and restore power safely.',
      priceGuide: 'From $150 callout fee',
      fullDescription: 'Our 24/7 emergency electrical service is available when you need it most. Whether it\'s a complete power outage, sparking outlets, or electrical faults, our licensed electricians respond quickly to restore safety and power to your property.',
      benefits: [
        '24/7 availability, 365 days a year',
        'Average response time under 1 hour (metro Sydney)',
        'Fully equipped emergency vehicles',
        'All work guaranteed and compliant',
        'Upfront pricing before we start',
      ],
      process: [
        'Call our emergency hotline: 0400 000 000',
        'Describe the issue and location',
        'Licensed electrician dispatched immediately',
        'Arrival within 60 minutes (metro areas)',
        'Diagnose and fix the issue safely',
        'Provide detailed invoice and safety report',
      ],
      image: wiringImage,
    },
    {
      id: 'switchboard',
      icon: Settings,
      title: 'Switchboard Upgrades',
      description: 'Modern, safe switchboards with RCD protection for your home or business.',
      priceGuide: 'From $800',
      fullDescription: 'Upgrade your old fuse box to a modern switchboard with safety switches (RCDs). Essential for older homes and required for insurance compliance. Our licensed electricians will assess, recommend, and install the right solution for your property.',
      benefits: [
        'Improved electrical safety for your family',
        'Prevents electrical fires and shocks',
        'Meets current Australian Standards',
        'Increased property value',
        'Supports modern appliances and EV chargers',
      ],
      process: [
        'Free on-site assessment and quote',
        'Recommend appropriate switchboard size',
        'Schedule installation at your convenience',
        'Install new switchboard (typically 3-5 hours)',
        'Test all circuits and safety devices',
        'Provide certificate of compliance',
      ],
      image: switchboardImage,
    },
    {
      id: 'rewiring',
      icon: Zap,
      title: 'Home Rewiring',
      description: 'Complete or partial rewiring services for older homes needing electrical updates.',
      priceGuide: 'Call for quote',
      fullDescription: 'If your home was built before 1990, you may have outdated or unsafe wiring. Our rewiring service brings your electrical system up to modern safety standards, supports today\'s power demands, and gives you peace of mind.',
      benefits: [
        'Eliminate fire and shock hazards',
        'Support modern appliances and devices',
        'Increase home value and saleability',
        'Improve energy efficiency',
        'Meet insurance requirements',
      ],
      process: [
        'Initial inspection and wiring assessment',
        'Detailed quote with scope of work',
        'Minimal disruption installation method',
        'Replace old wiring with modern cables',
        'Install new power points and switches',
        'Full testing and compliance certification',
      ],
      image: wiringImage,
    },
    {
      id: 'lighting',
      icon: Lightbulb,
      title: 'LED Lighting',
      description: 'Energy-efficient LED installations for indoor and outdoor spaces.',
      priceGuide: 'From $95 per fitting',
      fullDescription: 'Upgrade to energy-efficient LED lighting and reduce your power bills by up to 80%. We install high-quality LED downlights, feature lights, outdoor lighting, and smart lighting systems for homes and businesses.',
      benefits: [
        'Save up to 80% on lighting energy costs',
        'Longer lifespan (up to 50,000 hours)',
        'Better light quality and control',
        'Environmentally friendly',
        'Bulk installation discounts available',
      ],
      process: [
        'Discuss your lighting goals and budget',
        'Recommend suitable LED products',
        'Provide upfront quote',
        'Professional installation',
        'Test and demonstrate controls',
        '5-year warranty on all fittings',
      ],
      image: ceilingWorkImage,
    },
    {
      id: 'inspections',
      icon: ClipboardCheck,
      title: 'Safety Inspections',
      description: 'Comprehensive electrical safety checks with detailed compliance reports.',
      priceGuide: 'From $200',
      fullDescription: 'Essential for home buyers, sellers, and landlords. Our licensed electricians conduct thorough inspections of your electrical system and provide a detailed compliance report identifying any safety issues or necessary upgrades.',
      benefits: [
        'Identify safety hazards before they cause harm',
        'Required for property sales and rentals',
        'Peace of mind for your family',
        'Detailed written report with photos',
        'Recommendations prioritized by urgency',
      ],
      process: [
        'Book your inspection online or by phone',
        'Electrician conducts thorough inspection',
        'Test all circuits, outlets, and switches',
        'Check switchboard and wiring condition',
        'Provide detailed compliance report',
        'Quote for any necessary repairs',
      ],
      image: ceilingWorkImage,
    },
    {
      id: 'commercial',
      icon: Wrench,
      title: 'Commercial Work',
      description: 'Professional electrical services for offices, retail, and small businesses.',
      priceGuide: 'Call for quote',
      fullDescription: 'Keep your business running smoothly with our commercial electrical services. From fitouts and renovations to maintenance and emergency repairs, we understand the importance of minimizing downtime and disruption.',
      benefits: [
        'Minimize business disruption',
        'After-hours work available',
        'Preventative maintenance programs',
        'Emergency response priority',
        'Compliance and safety documentation',
      ],
      process: [
        'Initial site visit and consultation',
        'Detailed scope and fixed-price quote',
        'Schedule work to minimize disruption',
        'Professional installation and testing',
        'Provide all required documentation',
        'Ongoing maintenance available',
      ],
      image: switchboardImage,
    },
  ];

  const selectedServiceData = services.find(s => s.id === activeService);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0B4A6F] to-[#09324D] text-white py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6" style={{ fontWeight: 700, fontSize: '3rem' }}>
            Our Services
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto" style={{ fontSize: '1.25rem' }}>
            Professional electrical solutions for homes and businesses across Sydney
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                description={service.description}
                priceGuide={service.priceGuide}
                onLearnMore={() => setActiveService(service.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#F5F7F8]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2rem' }}>
            Need a Custom Solution?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            Don't see what you're looking for? We handle all types of electrical work. Get in touch for a custom quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('booking')}
              size="lg"
              className="bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800]"
            >
              Get a Free Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#0B4A6F] text-[#0B4A6F] hover:bg-[#0B4A6F] hover:text-white"
              asChild
            >
              <a href="tel:0400000000" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call 0400 000 000
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Detail Dialog */}
      <Dialog open={!!activeService} onOpenChange={() => setActiveService(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedServiceData && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center">
                    <selectedServiceData.icon className="w-7 h-7 text-[#FFCC00]" />
                  </div>
                  <div>
                    <DialogTitle className="text-[#1E2A31]" style={{ fontWeight: 700, fontSize: '1.75rem' }}>
                      {selectedServiceData.title}
                    </DialogTitle>
                    {selectedServiceData.priceGuide && (
                      <p className="text-[#0B4A6F]" style={{ fontWeight: 600 }}>
                        {selectedServiceData.priceGuide}
                      </p>
                    )}
                  </div>
                </div>
                <DialogDescription className="text-gray-700" style={{ fontSize: '1.0625rem', lineHeight: 1.6 }}>
                  {selectedServiceData.fullDescription}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Image */}
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedServiceData.image}
                    alt={selectedServiceData.title}
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-[#1E2A31] mb-4" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {selectedServiceData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#0B4A6F] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process */}
                <div>
                  <h3 className="text-[#1E2A31] mb-4" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                    Our Process
                  </h3>
                  <ol className="space-y-3">
                    {selectedServiceData.process.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="w-7 h-7 bg-[#FFCC00] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[#1E2A31]" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-gray-700 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* CTA */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => {
                      setActiveService(null);
                      onNavigate('booking');
                    }}
                    className="bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800] flex-1"
                  >
                    Book This Service
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#0B4A6F] text-[#0B4A6F] hover:bg-[#0B4A6F] hover:text-white flex-1"
                    asChild
                  >
                    <a href="tel:0400000000" className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
