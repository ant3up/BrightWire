import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Zap } from 'lucide-react';
import { COMPANY_INFO } from '../config/constants';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#1E2A31] text-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#FFCC00]" fill="#FFCC00" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-white" style={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2 }}>
                  BrightWire
                </span>
                <span className="text-gray-400" style={{ fontSize: '0.75rem', lineHeight: 1 }}>
                  Electrical
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-4" style={{ fontSize: '0.875rem' }}>
              Sydney's fast, reliable electricians. Licensed, insured, and available 24/7 for all your electrical needs.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#FFCC00] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFCC00] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFCC00] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Services', 'About', 'Pricing', 'Contact', 'FAQ'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate(item.toLowerCase())}
                    className="text-gray-400 hover:text-[#FFCC00] transition-colors"
                    style={{ fontSize: '0.875rem' }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>Our Services</h3>
            <ul className="space-y-2">
              {[
                'Emergency Callouts',
                'Switchboard Upgrades',
                'Home Rewiring',
                'LED Lighting',
                'Safety Inspections',
                'Commercial Work',
              ].map((service) => (
                <li key={service}>
                  <button
                    onClick={() => onNavigate('services')}
                    className="text-gray-400 hover:text-[#FFCC00] transition-colors"
                    style={{ fontSize: '0.875rem' }}
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#FFCC00] mt-0.5 flex-shrink-0" />
                <div>
                  <a href={COMPANY_INFO.phone.href} className="text-gray-400 hover:text-[#FFCC00] transition-colors" style={{ fontSize: '0.875rem' }}>
                    {COMPANY_INFO.phone.display}
                  </a>
                  <p className="text-gray-500" style={{ fontSize: '0.75rem' }}>24/7 Emergency Line</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#FFCC00] mt-0.5 flex-shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-gray-400 hover:text-[#FFCC00] transition-colors" style={{ fontSize: '0.875rem' }}>
                  {COMPANY_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FFCC00] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400" style={{ fontSize: '0.875rem' }}>
                  {COMPANY_INFO.address}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#FFCC00] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400" style={{ fontSize: '0.875rem' }}>{COMPANY_INFO.hours.weekdays}</p>
                  <p className="text-gray-400" style={{ fontSize: '0.875rem' }}>{COMPANY_INFO.hours.weekends}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400" style={{ fontSize: '0.875rem' }}>
            © 2025 BrightWire Electrical. All rights reserved. ABN: 12 345 678 901
          </p>
          <div className="flex gap-6">
            <button className="text-gray-400 hover:text-[#FFCC00] transition-colors" style={{ fontSize: '0.875rem' }}>
              Privacy Policy
            </button>
            <button className="text-gray-400 hover:text-[#FFCC00] transition-colors" style={{ fontSize: '0.875rem' }}>
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
