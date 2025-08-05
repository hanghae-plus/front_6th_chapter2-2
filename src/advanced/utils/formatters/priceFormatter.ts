export const formatPriceWithSoldOut = (
  price: number,
  isAdmin: boolean,
  isSoldOut: boolean,
): string => {
  if (isSoldOut) {
    return 'SOLD OUT';
  }
  return formatPrice(price, isAdmin);
};

export const formatPrice = (price: number, isAdmin: boolean): string => {
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
