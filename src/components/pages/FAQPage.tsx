import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { Phone } from 'lucide-react';
import { COMPANY_INFO } from '../../config/constants';

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

export function FAQPage({ onNavigate }: FAQPageProps) {
  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'Are you licensed and insured?',
          a: 'Yes, all our electricians are fully licensed with NSW Fair Trading and we carry $20 million in public liability insurance. We are also members of Master Electricians Australia.',
        },
        {
          q: 'Do you offer emergency services?',
          a: 'Yes, we provide 24/7 emergency electrical services across Sydney. Call 0400 000 000 for immediate assistance. Our average response time for metro areas is under 60 minutes.',
        },
        {
          q: 'What areas do you service?',
          a: 'We service all Sydney suburbs, from the Inner West to Eastern Suburbs, North Shore, and outer metropolitan areas. Call us to confirm service availability in your area.',
        },
        {
          q: 'How quickly can you come out?',
          a: 'For emergencies, we typically arrive within 60 minutes in metro areas. For non-emergency work, we offer same-day or next-day appointments depending on availability.',
        },
      ],
    },
    {
      category: 'Pricing & Payment',
      questions: [
        {
          q: 'How much do you charge?',
          a: 'Our pricing is transparent and competitive. Emergency callouts start from $150. Standard services like LED installation from $95 per fitting, and switchboard upgrades from $800. We always provide upfront quotes before starting work.',
        },
        {
          q: 'Do you provide free quotes?',
          a: 'Yes, we provide free, no-obligation quotes for all standard electrical work. For complex jobs, we may need to conduct an on-site assessment (small callout fee may apply, which is credited if you proceed).',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept cash, credit/debit cards, bank transfer, and payment plans for larger jobs. Payment is due upon completion of work.',
        },
        {
          q: 'Are there any hidden fees?',
          a: 'No. We provide upfront pricing and will never add surprise charges. If additional work is needed beyond the original scope, we\'ll discuss and quote it before proceeding.',
        },
      ],
    },
    {
      category: 'Services',
      questions: [
        {
          q: 'Can you install a switchboard in my home?',
          a: 'Yes, we specialize in switchboard upgrades and installations. We\'ll assess your current setup, recommend the appropriate size and features (including RCD safety switches), and complete the installation with full compliance certification.',
        },
        {
          q: 'Do you do commercial electrical work?',
          a: 'Yes, we service small to medium businesses including offices, retail stores, and cafes. We can work after hours to minimize disruption to your business.',
        },
        {
          q: 'Can you help with LED lighting upgrades?',
          a: 'Absolutely! We install high-quality LED downlights, feature lights, and outdoor lighting. LED upgrades can reduce your lighting energy costs by up to 80%. We offer bulk discounts for whole-home installations.',
        },
        {
          q: 'Do you provide electrical safety inspections?',
          a: 'Yes, we conduct comprehensive electrical safety inspections for home buyers, sellers, and landlords. You\'ll receive a detailed report with photos, compliance status, and recommendations prioritized by urgency.',
        },
      ],
    },
    {
      category: 'Booking & Process',
      questions: [
        {
          q: 'How do I book a service?',
          a: 'You can book online through our contact form, call us at 0400 000 000, or send an SMS. We\'ll respond within 1 business hour to confirm your booking.',
        },
        {
          q: 'What happens after I book?',
          a: 'We\'ll confirm your appointment, send you an SMS reminder, and our electrician will arrive at the scheduled time with all necessary equipment. They\'ll assess the job, provide a quote if needed, complete the work, and provide you with an invoice and any required certificates.',
        },
        {
          q: 'Do I need to be home during the service?',
          a: 'For most jobs, yes. However, if you need us to access your property while you\'re away, we can arrange a secure key pickup or lockbox access. Just let us know when booking.',
        },
        {
          q: 'What if you can\'t fix the problem on the day?',
          a: 'We come fully equipped for most jobs. However, if we need to order specialized parts, we\'ll let you know immediately, provide a timeline, and make your property safe in the interim.',
        },
      ],
    },
    {
      category: 'Safety & Compliance',
      questions: [
        {
          q: 'Do you provide certificates of compliance?',
          a: 'Yes, all our work comes with the necessary compliance certificates as required by NSW regulations and Australian Standards (AS/NZS 3000:2018).',
        },
        {
          q: 'Is your work guaranteed?',
          a: 'Yes, all our workmanship is backed by a 5-year warranty. We also provide manufacturer warranties on all products and fittings we install.',
        },
        {
          q: 'What safety standards do you follow?',
          a: 'We strictly adhere to Australian Standards AS/NZS 3000:2018 (Wiring Rules) and all relevant NSW electrical safety regulations. Every job includes comprehensive safety testing.',
        },
        {
          q: 'When should I call for an emergency?',
          a: 'Call our emergency line immediately if you experience: complete power loss, sparking or smoking outlets, burning smells, exposed wiring, or any electrical hazard that poses immediate danger.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0B4A6F] to-[#09324D] text-white py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6" style={{ fontWeight: 700, fontSize: '3rem' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto" style={{ fontSize: '1.25rem' }}>
            Everything you need to know about our electrical services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-6 lg:px-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-[#1E2A31] mb-6" style={{ fontWeight: 700, fontSize: '2rem' }}>
                {category.category}
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${categoryIndex}-${faqIndex}`}
                    className="border border-gray-200 rounded-lg px-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-[#1E2A31] hover:text-[#0B4A6F] text-left py-5" style={{ fontWeight: 600, fontSize: '1.0625rem' }}>
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 pb-5" style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 bg-[#F5F7F8]">
        <div className="max-w-[900px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-[#1E2A31] mb-4" style={{ fontWeight: 700, fontSize: '2rem' }}>
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
            Can't find the answer you're looking for? Give us a call or send us a message and we'll be happy to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800]"
              asChild
            >
              <a href={COMPANY_INFO.phone.href} className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call {COMPANY_INFO.phone.display}
              </a>
            </Button>
            <Button
              onClick={() => onNavigate('booking')}
              size="lg"
              variant="outline"
              className="border-[#0B4A6F] text-[#0B4A6F] hover:bg-[#0B4A6F] hover:text-white"
            >
              Send Us a Message
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
