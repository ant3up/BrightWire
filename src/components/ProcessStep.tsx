import { LucideIcon } from 'lucide-react';

interface ProcessStepProps {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ProcessStep({ number, icon: Icon, title, description }: ProcessStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-[#0B4A6F] to-[#09324D] rounded-full flex items-center justify-center">
          <Icon className="w-9 h-9 text-[#FFCC00]" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFCC00] rounded-full flex items-center justify-center shadow-lg">
          <span className="text-[#1E2A31]" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
            {number}
          </span>
        </div>
      </div>
      <h3 className="text-[#1E2A31] mb-2" style={{ fontWeight: 600, fontSize: '1.125rem' }}>{title}</h3>
      <p className="text-gray-600 max-w-[250px]">{description}</p>
    </div>
  );
}
