import { Shield, Award, MapPin, Clock, CheckCircle, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';
import aboutHeaderImage from 'figma:asset/d9d9edd909914a0f5d37d5ffebb8245f55567c6d.png';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const team = [
    {
      name: 'David Wilson',
      role: 'Master Electrician & Owner',
      initials: 'DW',
      description: '15+ years experience, Level 2 licensed',
    },
    {
      name: 'Sarah Chen',
      role: 'Senior Electrician',
      initials: 'SC',
      description: '10 years experience, Commercial specialist',
    },
    {
      name: 'Michael Torres',
      role: 'Licensed Electrician',
      initials: 'MT',
      description: '8 years experience, Residential expert',
    },
  ];

  const suburbs = [
    'Newtown', 'Bondi', 'Parramatta', 'Chatswood', 'Manly', 'Surry Hills',
    'Randwick', 'North Sydney', 'Strathfield', 'Leichhardt', 'Marrickville',
    'Coogee', 'Glebe', 'Balmain', 'Pyrmont', 'Redfern', 'Paddington',
    'Woollahra', 'Double Bay', 'Mosman', 'Neutral Bay', 'Rozelle',
    'Annandale', 'Erskineville', 'Alexandria', '+ All Sydney suburbs',
  ];

  const accreditations = [
    { title: 'Licensed Electrician', description: 'NSW Fair Trading License' },
    { title: 'Master Electricians', description: 'Member of MEA' },
    { title: '$20M Insurance', description: 'Public liability coverage' },
    { title: 'Level 2 Certified', description: 'Authorized service provider' },
    { title: 'Safety Compliant', description: 'AS/NZS 3000:2018' },
    { title: '5-Year Warranty', description: 'All workmanship guaranteed' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0B4A6F] to-[#09324D] text-white py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-white mb-6" style={{ fontWeight: 700, fontSize: '3rem' }}>
                About BrightWire Electrical
              </h1>
              <p className="text-blue-100 mb-6" style={{ fontSize: '1.25rem', lineHeight: 1.6 }}>
                We're Sydney's trusted electrical experts, committed to delivering safe, reliable, and professional electrical services to homes and businesses across the city.
              </p>
              <p className="text-blue-100" style={{ fontSize: '1.0625rem', lineHeight: 1.6 }}>
                Since 2010, we've built our reputation on quality workmanship, transparent pricing, and exceptional customer service. Every member of our team is fully licensed, insured, and dedicated to keeping your property safe.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={aboutHeaderImage}
                  alt="Professional electrician installing wiring"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Safety First',
                description: 'Every job includes comprehensive safety checks and compliance with Australian Standards. Your safety is never compromised.',
              },
              {
                icon: CheckCircle,
                title: 'Quality Work',
                description: 'We take pride in our craftsmanship. Every installation is done right the first time, backed by our 5-year warranty.',
              },
              {
                icon: Users,
                title: 'Customer Focus',
                description: 'Clear communication, transparent pricing, and respect for your property. We treat your home like our own.',
              },
            ].map((value, index) => (
              <Card key={index} className="p-8 text-center border border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[#FFCC00]" />
                </div>
                <h3 className="text-[#1E2A31] mb-3" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#F5F7F8]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Fully licensed, experienced electricians you can trust
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center bg-white border border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white" style={{ fontWeight: 700, fontSize: '2rem' }}>
                    {member.initials}
                  </span>
                </div>
                <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                  {member.name}
                </h3>
                <p className="text-[#0B4A6F] mb-2" style={{ fontWeight: 500, fontSize: '0.9375rem' }}>
                  {member.role}
                </p>
                <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                  {member.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
              Qualifications & Accreditations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Fully licensed, insured, and compliant with all Australian Standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accreditations.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-[#F5F7F8] rounded-lg">
                <div className="w-10 h-10 bg-[#FFCC00] rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[#1E2A31]" />
                </div>
                <div>
                  <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600, fontSize: '1.0625rem' }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-20 bg-[#F5F7F8]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
              Service Area
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Proudly serving Greater Sydney and surrounding suburbs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#FFCC00]" />
                  </div>
                  <div>
                    <h3 className="text-[#1E2A31] mb-2" style={{ fontWeight: 600, fontSize: '1.5rem' }}>
                      Sydney-Wide Coverage
                    </h3>
                    <p className="text-gray-600" style={{ fontSize: '1.0625rem' }}>
                      We service all Sydney suburbs, from the Inner West to the Eastern Suburbs, North Shore, and beyond.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#FFCC00]" />
                  </div>
                  <div>
                    <h3 className="text-[#1E2A31] mb-2" style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                      Fast Response Times
                    </h3>
                    <p className="text-gray-600">
                      <strong>Metro areas:</strong> Within 60 minutes<br />
                      <strong>Outer suburbs:</strong> Same-day service<br />
                      <strong>Emergency:</strong> Available 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[#1E2A31] mb-4" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                Suburbs We Service
              </h3>
              <div className="flex flex-wrap gap-2">
                {suburbs.map((suburb, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white border border-gray-200 text-gray-700 hover:bg-[#F5F7F8]"
                  >
                    {suburb}
                  </Badge>
                ))}
              </div>
              <p className="mt-6 text-gray-600" style={{ fontSize: '0.875rem' }}>
                Don't see your suburb? Call us! We service all of Greater Sydney.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] text-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6" style={{ fontWeight: 700, fontSize: '2.5rem' }}>
            Ready to Work With Us?
          </h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto" style={{ fontSize: '1.25rem' }}>
            Experience the BrightWire difference. Professional, reliable electrical services you can trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('booking')}
              size="lg"
              className="bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800] shadow-lg"
              style={{ fontSize: '1.125rem' }}
            >
              Get a Free Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#0B4A6F]"
              onClick={() => onNavigate('services')}
            >
              View Our Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
