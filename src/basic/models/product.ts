import { Product, CartItem } from "../../types";

// 상품 검색 및 필터링
export const searchProducts = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm.trim()) {
    return products;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerSearchTerm))
  );
};

// 상품 재고 확인
export const isProductInStock = (product: Product, cart: CartItem[]): boolean => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  return product.stock > quantityInCart;
};

// 상품 가격 포맷팅
export const formatProductPrice = (price: number): string => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

// 상품 할인율 계산
export const calculateProductDiscountRate = (product: Product): number => {
  if (!product.discounts || product.discounts.length === 0) {
    return 0;
  }

  // 가장 높은 할인율 반환
  return Math.max(...product.discounts.map((discount) => discount.rate));
};

// 상품이 할인 중인지 확인
export const isProductOnDiscount = (product: Product): boolean => {
  return calculateProductDiscountRate(product) > 0;
};

// 상품의 최소 주문 수량 확인
export const getMinimumOrderQuantity = (product: Product): number => {
  if (!product.discounts || product.discounts.length === 0) {
    return 1;
  }

  // 가장 낮은 할인 수량 기준 반환
  return Math.min(...product.discounts.map((discount) => discount.quantity));
};

// 상품의 최대 주문 가능 수량 계산
export const getMaximumOrderQuantity = (product: Product, cart: CartItem[]): number => {
  const remainingStock = getRemainingStock(product, cart);
  return Math.min(remainingStock, 99); // 최대 99개로 제한
};

// 남은 재고 계산 (cart.ts에서 가져온 함수)
const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  return Math.max(0, product.stock - quantityInCart);
};

// 상품 가격 범위별 필터링
export const filterProductsByPriceRange = (products: Product[], minPrice?: number, maxPrice?: number): Product[] => {
  return products.filter((product) => {
    const price = product.price;
    const meetsMinPrice = minPrice === undefined || price >= minPrice;
    const meetsMaxPrice = maxPrice === undefined || price <= maxPrice;
    return meetsMinPrice && meetsMaxPrice;
  });
};

// 상품 정렬
export const sortProducts = (
  products: Product[],
  sortBy: "name" | "price" | "stock" = "name",
  sortOrder: "asc" | "desc" = "asc"
): Product[] => {
  const sortedProducts = [...products];

  sortedProducts.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case "name":
        aValue = a.name;
        bValue = b.name;
        break;
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "stock":
        aValue = a.stock;
        bValue = b.stock;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === "asc" ? comparison : -comparison;
    } else {
      const comparison = (aValue as number) - (bValue as number);
      return sortOrder === "asc" ? comparison : -comparison;
    }
  });

  return sortedProducts;
};

// 상품 유효성 검사
export const validateProduct = (
  product: Product
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length === 0) {
    errors.push("상품명은 필수입니다.");
  }

  if (product.price < 0) {
    errors.push("가격은 0 이상이어야 합니다.");
  }

  if (product.stock < 0) {
    errors.push("재고는 0 이상이어야 합니다.");
  }

  if (!product.description || product.description.trim().length === 0) {
    errors.push("상품 설명은 필수입니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
