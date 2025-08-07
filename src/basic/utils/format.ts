const SOLD_OUT_MESSAGE = 'SOLD OUT';

interface PriceFormatOptions {
  showSymbol?: boolean;
  isSoldOut?: boolean;
  isAdmin?: boolean;
}

export const formatPrice = (
  price: number,
  options: PriceFormatOptions = {
    showSymbol: true,
    isSoldOut: false,
    isAdmin: false,
  }
): string => {
  if (options.isSoldOut) {
    return SOLD_OUT_MESSAGE;
  }

  if (options.isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  if (options.showSymbol) {
    return `₩${price.toLocaleString()}`;
  }

  return price.toLocaleString();
};
