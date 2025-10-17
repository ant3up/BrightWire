import { LucideIcon } from 'lucide-react';

interface TrustBadgeProps {
  icon: LucideIcon;
  text: string;
}

export function TrustBadge({ icon: Icon, text }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200">
      <Icon className="w-4 h-4 text-[#0B4A6F] flex-shrink-0" />
      <span className="text-[#1E2A31]" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        {text}
      </span>
    </div>
  );
}
