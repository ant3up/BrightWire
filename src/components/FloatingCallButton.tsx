import { Phone } from 'lucide-react';
import { Button } from './ui/button';
import { COMPANY_INFO } from '../config/constants';

export function FloatingCallButton() {
  return (
    <a
      href={COMPANY_INFO.phone.href}
      className="fixed bottom-6 right-6 z-50 lg:hidden"
    >
      <Button
        size="lg"
        className="w-16 h-16 rounded-full bg-[#FFCC00] text-[#1E2A31] hover:bg-[#E6B800] shadow-2xl hover:shadow-3xl transition-all hover:scale-110 p-0"
      >
        <Phone className="w-7 h-7" />
      </Button>
    </a>
  );
}
