export function formatKRWPrice(price: number, format: 'text' | 'symbol' = 'text'): string {
  return format === 'text' ? `${price.toLocaleString()}원` : `₩${price.toLocaleString()}`;
}

export function convertPercentageToRate(percentage: number): number {
  return percentage / 100;
}

export function convertRateToPercentage(rate: number): number {
  return rate * 100;
}
