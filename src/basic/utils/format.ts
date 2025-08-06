import { Product, CartItem } from '../../types';

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

export const formatPriceWithStock = (
  price: number,
  productId: string,
  products: Product[],
  cart: CartItem[],
  isAdmin: boolean = false
): string => {
  const product = products.find((p) => p.id === productId);
  if (product) {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remainingStock = product.stock - (cartItem?.quantity || 0);

    if (remainingStock <= 0) {
      return SOLD_OUT_MESSAGE;
    }
  }

  return formatPrice(price, { isAdmin, showSymbol: !isAdmin });
};
