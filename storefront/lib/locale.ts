const LOCALE = "sv-SE";
const CURRENCY = "SEK";

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatPrice(amountInOre: number): string {
  return currencyFormatter.format(amountInOre / 100);
}

export function formatPriceRaw(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}

export function formatShortDate(date: Date | string): string {
  return shortDateFormatter.format(new Date(date));
}

const numberFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPriceParts(amount: number): { number: string; currency: string } {
  return { number: numberFormatter.format(amount), currency: "kr" };
}

export { LOCALE, CURRENCY };
