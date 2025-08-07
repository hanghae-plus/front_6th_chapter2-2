export const calculateDiscountedPrice = (price: number, quantity: number, discountRate: number): number => {
  if (price <= 0 || quantity <= 0) {
    return 0;
  }

  if (discountRate < 0 || discountRate > 1) {
    console.error('[calculateDiscountedPrice] invalid discountRate:', discountRate);
    return 0;
  }

  return Math.round(price * quantity * (1 - discountRate));
};
