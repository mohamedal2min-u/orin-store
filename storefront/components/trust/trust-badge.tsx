import React from 'react';

interface TrustBadgeProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export const TrustBadge = ({ icon, title, subtitle, className = '' }: TrustBadgeProps) => {
  return (
    <div className={`flex items-start gap-4 p-4 border border-neutral-200 bg-white ${className}`}>
      <div className="flex-shrink-0 text-neutral-900 mt-0.5">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium tracking-tight text-neutral-900">{title}</span>
        {subtitle && (
          <span className="text-xs text-neutral-500 mt-1">{subtitle}</span>
        )}
      </div>
    </div>
  );
};

interface TrustBadgeInlineProps {
  icon?: React.ReactNode;
  title?: string;
  className?: string;
}

const DefaultLockIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export const TrustBadgeInline = ({ 
  icon = <DefaultLockIcon />, 
  title = "Säker utcheckning & Snabb leverans", 
  className = '' 
}: TrustBadgeInlineProps) => {
  return (
    <div className={`flex items-center gap-2 text-neutral-600 ${className}`}>
      <div className="flex-shrink-0 text-neutral-500">
        {icon}
      </div>
      <span className="text-xs font-medium tracking-tight uppercase">{title}</span>
    </div>
  );
};
