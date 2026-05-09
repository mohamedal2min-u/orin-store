import React from 'react';
import { KlarnaLogo, SwishLogo, VisaLogo, MastercardLogo } from './icons/payment-logos';

export function CardBrands() {
  return (
    <div className="flex items-center gap-3 transition-opacity duration-300">
      <KlarnaLogo />
      <SwishLogo />
      <VisaLogo />
      <MastercardLogo />
    </div>
  );
}
