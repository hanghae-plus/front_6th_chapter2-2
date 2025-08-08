export const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

export const calculateDiscountedPrice = (
  price: number,
  discountPercent: number
): number => {
  return price * (1 - discountPercent / 100);
};

export const calculateDiscountedAmount = (
  price: number,
  discountAmount: number
): number => {
  return Math.max(0, price - discountAmount);
};
