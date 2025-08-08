export const isValidCouponCode = (code: string): boolean => {
  const regex = /^[A-Z0-9]{4,12}$/;
  return regex.test(code);
};

export const isValidStock = (stock: number): boolean => {
  return Number.isInteger(stock) && stock >= 0;
};

export const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && price > 0;
};

export const extractNumbers = (value: string): string => {
  return value.replace(/\D/g, '');
};
