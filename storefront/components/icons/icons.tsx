import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number;
}

export const ShieldIcon = ({ size = 24, strokeWidth = 1, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const TruckIcon = ({ size = 24, strokeWidth = 1, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
    {...props}
  >
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export const SwapIcon = ({ size = 24, strokeWidth = 1, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
    {...props}
  >
    <path d="M4 9h16" />
    <path d="M4 9l4-4" />
    <path d="M20 15H4" />
    <path d="M20 15l-4 4" />
  </svg>
);

export const LockIcon = ({ size = 24, strokeWidth = 1, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="0" ry="0" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
