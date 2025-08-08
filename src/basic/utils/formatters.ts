export const formatPrice = (
  price: number,
  productId?: string,
  isAdmin: boolean = false,
  remainingStock?: number
): string => {
  if (productId && remainingStock !== undefined && remainingStock <= 0) {
    return 'SOLD OUT';
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }
  return `₩${price.toLocaleString()}`;
};
