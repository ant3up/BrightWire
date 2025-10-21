import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card } from '../ui/card';
import { useState } from 'react';
import { COMPANY_INFO } from '../../config/constants';

interface BookingPageProps {
  onNavigate: (page: string) => void;
}

export function BookingPage({ onNavigate }: BookingPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    suburb: '',
    service: '',
    message: '',
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to a backend
    onNavigate('thankyou');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const services = [
    'Emergency Callout',
    'Switchboard Upgrade',
    'Home Rewiring',
    'LED Lighting',
    'Safety Inspection',
    'Commercial Work',
    'Other',
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0B4A6F] to-[#09324D] text-white py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6" style={{ fontWeight: 700, fontSize: '3rem' }}>
            Contact & Booking
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto" style={{ fontSize: '1.25rem' }}>
            Get a free quote or book your service. We'll respond within 1 business hour.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="text-[#1E2A31] mb-6" style={{ fontWeight: 700, fontSize: '2rem' }}>
                Get In Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Call us directly for immediate assistance or fill out the form and we'll get back to you within 1 business hour.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4 mb-8">
                <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#FFCC00]" />
                    </div>
                    <div>
                      <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600 }}>
                        Phone
                      </h3>
                      <a
                        href={COMPANY_INFO.phone.href}
                        className="text-[#0B4A6F] hover:text-[#09324D] transition-colors"
                        style={{ fontWeight: 600, fontSize: '1.125rem' }}
                      >
                        {COMPANY_INFO.phone.display}
                      </a>
                      <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>
                        24/7 Emergency Line
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#FFCC00]" />
                    </div>
                    <div>
                      <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600 }}>
                        Email
                      </h3>
                      <a
                        href="mailto:info@brightwire.com.au"
                        className="text-[#0B4A6F] hover:text-[#09324D] transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        info@brightwire.com.au
                      </a>
                      <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>
                        We respond within 1 business hour
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#FFCC00]" />
                    </div>
                    <div>
                      <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600 }}>
                        Service Area
                      </h3>
                      <p className="text-gray-600">
                        All Sydney suburbs
                      </p>
                      <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>
                        Fast response metro & outer areas
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#FFCC00]" />
                    </div>
                    <div>
                      <h3 className="text-[#1E2A31] mb-1" style={{ fontWeight: 600 }}>
                        Business Hours
                      </h3>
                      <p className="text-gray-600">Mon-Fri: 7am - 6pm</p>
                      <p className="text-gray-600">Sat-Sun: Emergency Only</p>
                      <p className="text-gray-500 mt-1" style={{ fontSize: '0.875rem' }}>
                        24/7 emergency service available
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800]"
                  size="lg"
                  asChild
                >
                  <a href={COMPANY_INFO.phone.href} className="flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Now — Emergency Line
                  </a>
                </Button>
                <Button
                  className="w-full bg-[#25D366] text-white hover:bg-[#20BA5A]"
                  size="lg"
                  asChild
                >
                  <a href={COMPANY_INFO.phone.sms} className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Send SMS
                  </a>
                </Button>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-3">
              <Card className="p-8 border border-gray-200 shadow-lg">
                <h2 className="text-[#1E2A31] mb-6" style={{ fontWeight: 700, fontSize: '2rem' }}>
                  Request a Free Quote
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you within 1 business hour with a quote.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="0400 000 000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  {/* Suburb */}
                  <div>
                    <Label htmlFor="suburb">
                      Suburb <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="suburb"
                      required
                      placeholder="e.g., Newtown, Bondi, Parramatta"
                      value={formData.suburb}
                      onChange={(e) => handleInputChange('suburb', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  {/* Service Type */}
                  <div>
                    <Label htmlFor="service">
                      Service Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      required
                      value={formData.service}
                      onValueChange={(value) => handleInputChange('service', value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      required
                      placeholder="Please describe your electrical needs or issue..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="mt-1.5 min-h-[120px]"
                    />
                  </div>

                  {/* Consent */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      required
                      checked={formData.consent}
                      onCheckedChange={(checked) => handleInputChange('consent', !!checked)}
                      className="mt-1"
                    />
                    <Label htmlFor="consent" className="cursor-pointer" style={{ fontSize: '0.875rem', fontWeight: 400 }}>
                      I consent to {COMPANY_INFO.name} contacting me about my enquiry. We respect your privacy and will never share your details.
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#0B4A6F] text-white hover:bg-[#09324D]"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Request
                  </Button>

                  <p className="text-center text-gray-500" style={{ fontSize: '0.875rem' }}>
                    Expected response time: Within 1 business hour
                  </p>
                </form>
              </Card>

              {/* Booking Calendar Placeholder */}
              <Card className="p-8 border border-gray-200 shadow-lg mt-8">
                <h3 className="text-[#1E2A31] mb-4" style={{ fontWeight: 600, fontSize: '1.5rem' }}>
                  Book Online (Coming Soon)
                </h3>
                <div className="bg-[#F5F7F8] rounded-lg p-12 text-center">
                  <p className="text-gray-600 mb-4">
                    Online booking calendar will be integrated here (e.g., Calendly)
                  </p>
                  <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>
                    For now, please call us or use the form above
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
