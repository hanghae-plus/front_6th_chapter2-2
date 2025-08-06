export const formatPrice = (
  price: number,
  isAdmin: boolean = false
): string => {
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};

export const formatProductPrice = (
  price: number,
  isAdmin: boolean = false
): string => {
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
