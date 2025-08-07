export const formatPrice = (
  price: number,
  isAdmin: boolean = false,
  isSoldOut: boolean = false
): string => {
  if (isSoldOut) {
    return 'SOLD OUT';
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
