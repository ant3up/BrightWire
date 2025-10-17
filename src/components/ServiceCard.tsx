import { ArrowRight, LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  priceGuide?: string;
  onLearnMore: () => void;
}

export function ServiceCard({ icon: Icon, title, description, priceGuide, onLearnMore }: ServiceCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200 bg-white group cursor-pointer" onClick={onLearnMore}>
      <div className="w-14 h-14 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-[#FFCC00]" />
      </div>
      <h3 className="text-[#1E2A31] mb-2" style={{ fontWeight: 600, fontSize: '1.125rem' }}>{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {priceGuide && (
        <p className="text-[#0B4A6F] mb-4" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          {priceGuide}
        </p>
      )}
      <button
        onClick={onLearnMore}
        className="text-[#0B4A6F] hover:text-[#09324D] flex items-center gap-2 transition-colors group-hover:gap-3"
        style={{ fontWeight: 600, fontSize: '0.875rem' }}
      >
        Learn More
        <ArrowRight className="w-4 h-4" />
      </button>
    </Card>
  );
}
