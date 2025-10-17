import { Star } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';

interface TestimonialCardProps {
  rating: number;
  quote: string;
  name: string;
  suburb: string;
}

export function TestimonialCard({ rating, quote, name, suburb }: TestimonialCardProps) {
  return (
    <Card className="p-6 bg-white border border-gray-200">
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-[#FFCC00] fill-[#FFCC00]' : 'text-gray-300'}`}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-gray-700 mb-6" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
        "{quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 bg-gradient-to-br from-[#0B4A6F] to-[#09324D]">
          <AvatarFallback className="text-white" style={{ fontWeight: 600 }}>
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-[#1E2A31]" style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</p>
          <p className="text-gray-500" style={{ fontSize: '0.8125rem' }}>{suburb}</p>
        </div>
      </div>
    </Card>
  );
}
