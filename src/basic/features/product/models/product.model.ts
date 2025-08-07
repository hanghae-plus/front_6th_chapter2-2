import { CartItem } from "@/basic/features/cart/types/cart.type";
import { Product, ProductWithUI } from "@/basic/features/product/types/product";
import { formatPrice } from "@/basic/shared/utils/format.util";
import { filterArrayBySearchTerm } from "@/basic/shared/utils/search.util";

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
  return isAdmin ? formatPrice.unit(price) : formatPrice.currency(price);
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

function extractProductSearchFields(
  product: ProductWithUI
): (string | undefined)[] {
  return [product.name, product.description];
}

const searchProducts = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  return filterArrayBySearchTerm(
    products,
    searchTerm,
    extractProductSearchFields
  );
};

export const productModel = {
  isProductSoldout,
  formatProductPrice,
  getFormattedProductPrice,
  searchProducts,
};
