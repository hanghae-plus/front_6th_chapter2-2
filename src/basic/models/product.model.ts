import { formatPrice } from "@/basic/utils";
import { CartItem, Product, ProductWithUI } from "@/types";

const isProductSoldout = ({
  productId,
  products,
  cart,
}: {
  productId: string;
  products: Product[];
  cart: CartItem[];
}): boolean => {
  const product = products.find((p) => p.id === productId);
  if (!product) return false;

  const cartItem = cart.find((item) => item.product.id === productId);
  return product.stock - (cartItem?.quantity || 0) <= 0;
};

const formatProductPrice = ({
  price,
  isAdmin = false,
}: {
  price: number;
  isAdmin?: boolean;
}): string => {
  return isAdmin ? `${price.toLocaleString()}원` : formatPrice(price);
};

const getFormattedProductPrice = ({
  productId,
  products,
  cart,
  isAdmin,
}: {
  productId: string;
  products: ProductWithUI[];
  cart: CartItem[];
  isAdmin: boolean;
}): string => {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    throw new Error("상품을 찾을 수 없습니다.");
  }

  const isSoldout = isProductSoldout({ productId, products, cart });
  if (isSoldout) {
    return "SOLD OUT";
  }

  const price = formatProductPrice({ price: product.price, isAdmin });
  return price;
};

export const productModel = {
  isProductSoldout,
  formatProductPrice,
  getFormattedProductPrice,
};
