export const formatPriceForAdmin = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

export const formatPriceForShop = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};