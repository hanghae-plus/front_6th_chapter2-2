export const formatPrice = (
  price: number,
  isSoldOut: boolean,
  isAdmin: boolean
): string => {
  if (isSoldOut) {
    return "SOLD OUT";
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
