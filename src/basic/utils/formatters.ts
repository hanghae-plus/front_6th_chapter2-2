export const formatPrice = (price: number, options = { isAdmin: false }): string => {
  if (options.isAdmin) {
    return `${price.toLocaleString()}원`;
  }
  return `₩${price.toLocaleString()}`;
};
