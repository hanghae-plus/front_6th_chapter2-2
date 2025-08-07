export function isValidCouponCode(code: string): boolean {
  return /^[A-Z0-9]{4,12}$/.test(code);
}

export function isValidMinimumStock(stock: number): boolean {
  return stock >= 0;
}

export function isValidMaximumStock(stock: number): boolean {
  return stock <= 9999;
}

export function isValidPrice(price: number): boolean {
  return price > 0;
}

export function isNumber(value: string): boolean {
  return /^\d+$/.test(value);
}

export function isEmptyValue(value: string): boolean {
  return value === '';
}
