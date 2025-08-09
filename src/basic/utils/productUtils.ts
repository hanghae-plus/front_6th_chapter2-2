import { CartItem, Product } from "../../types";

/**
 * 상품 검색 필터링
 */
export const filterProducts = (
  //TODO: 진석 리팩토링 필요
  products: Product[],
  searchTerm: string
): Product[] => {
  if (!searchTerm) return products;

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};

/**
 * 상품 ID 생성
 */
export const generateProductId = (): string => {
  return "p" + Date.now();
};

/**
 * 상품 데이터 유효성 검증
 */
export const validateProductData = (product: Partial<Product>): boolean => {
  return !!(
    product.name &&
    product.name.trim() &&
    product.price &&
    product.price > 0 &&
    product.stock !== undefined &&
    product.stock >= 0
  );
};

/**
 * 남은 재고 계산
 */
const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const getRefinedProduct = (product: Product, cart: CartItem[]) => {
  return {
    ...product,
    stock: getRemainingStock(product, cart),
  } satisfies Product;
};
