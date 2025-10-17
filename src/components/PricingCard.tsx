import { Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  onBookNow: () => void;
}

export function PricingCard({ title, description, price, features, highlighted = false, onBookNow }: PricingCardProps) {
  return (
    <Card
      className={`p-8 relative ${
        highlighted
          ? 'border-2 border-[#FFCC00] shadow-xl bg-gradient-to-b from-white to-[#FFFEF5]'
          : 'border border-gray-200 bg-white'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFCC00] text-[#1E2A31] px-4 py-1 rounded-full" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Most Popular
        </div>
      )}

      <h3 className="text-[#1E2A31] mb-2" style={{ fontWeight: 700, fontSize: '1.5rem' }}>{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-[#0B4A6F]" style={{ fontWeight: 700, fontSize: '2.5rem' }}>{price}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 bg-[#0B4A6F]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 text-[#0B4A6F]" />
            </div>
            <span className="text-gray-700" style={{ fontSize: '0.9375rem' }}>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onBookNow}
        className={`w-full ${
          highlighted
            ? 'bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800]'
            : 'bg-[#0B4A6F] text-white hover:bg-[#09324D]'
        }`}
      >
        Book Now
      </Button>
    </Card>
  );
}
