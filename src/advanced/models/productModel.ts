// 상품 관련 비즈니스 로직 (순수 함수)
import { Product, Discount } from "../type/types";
import {
  isValidProductName,
  isValidPrice,
  isValidStock,
} from "../utils/validators";
import { isValidDiscount as isValidDiscountBase } from "./discountModel";

// 검증 함수들은 utils/validators.ts에서 import

/**
 * 상품의 할인 규칙 유효성을 검증합니다 (상품별 추가 제약 포함)
 * @param discount 검증할 할인 규칙
 * @returns 유효한 할인 규칙이면 true, 그렇지 않으면 false
 */
export function isValidProductDiscount(discount: Discount): boolean {
  // 기본 할인 검증 + 상품별 추가 제약 (수량 범위 1-1000)
  return (
    isValidDiscountBase(discount) &&
    Number.isInteger(discount.quantity) &&
    discount.quantity > 0 &&
    discount.quantity <= 1000
  );
}

/**
 * 새로운 상품을 생성합니다
 * @param productData 상품 생성 데이터
 * @returns 생성된 상품 또는 null (유효하지 않은 경우)
 */
export function createProduct(productData: {
  name: string;
  price: number;
  stock: number;
  discounts?: Discount[];
}): Omit<Product, "id"> | null {
  const { name, price, stock, discounts = [] } = productData;

  // 필수 필드 검증
  if (!isValidProductName(name)) {
    return null;
  }

  if (!isValidPrice(price)) {
    return null;
  }

  if (!isValidStock(stock)) {
    return null;
  }

  // 할인 규칙 검증
  if (!discounts.every(isValidProductDiscount)) {
    return null;
  }

  // 중복된 수량의 할인 규칙이 있는지 확인
  const quantities = discounts.map((d) => d.quantity);
  if (new Set(quantities).size !== quantities.length) {
    return null;
  }

  return {
    name: name.trim(),
    price,
    stock,
    discounts: discounts.sort((a, b) => a.quantity - b.quantity), // 수량 기준 정렬
  };
}

/**
 * 상품 정보를 업데이트합니다
 * @param product 기존 상품
 * @param updates 업데이트할 정보
 * @returns 업데이트된 상품 또는 null (유효하지 않은 경우)
 */
export function updateProduct(
  product: Product,
  updates: Partial<Omit<Product, "id">>
): Product | null {
  const updatedProduct = { ...product, ...updates };

  // 업데이트된 정보 검증
  if (!isValidProductName(updatedProduct.name)) {
    return null;
  }

  if (!isValidPrice(updatedProduct.price)) {
    return null;
  }

  if (!isValidStock(updatedProduct.stock)) {
    return null;
  }

  if (!updatedProduct.discounts.every(isValidProductDiscount)) {
    return null;
  }

  // 중복된 수량의 할인 규칙이 있는지 확인
  const quantities = updatedProduct.discounts.map((d) => d.quantity);
  if (new Set(quantities).size !== quantities.length) {
    return null;
  }

  return {
    ...updatedProduct,
    name: updatedProduct.name.trim(),
    discounts: updatedProduct.discounts.sort((a, b) => a.quantity - b.quantity),
  };
}

/**
 * 상품의 재고를 업데이트합니다
 * @param product 상품
 * @param newStock 새로운 재고 수량
 * @returns 재고가 업데이트된 상품 또는 null (유효하지 않은 재고인 경우)
 */
export function updateProductStock(
  product: Product,
  newStock: number
): Product | null {
  if (!isValidStock(newStock)) {
    return null;
  }

  return {
    ...product,
    stock: newStock,
  };
}

/**
 * 상품에 할인 규칙을 추가합니다
 * @param product 상품
 * @param discount 추가할 할인 규칙
 * @returns 할인 규칙이 추가된 상품 또는 null (유효하지 않거나 중복인 경우)
 */
export function addProductDiscount(
  product: Product,
  discount: Discount
): Product | null {
  if (!isValidProductDiscount(discount)) {
    return null;
  }

  // 같은 수량의 할인 규칙이 이미 있는지 확인
  if (product.discounts.some((d) => d.quantity === discount.quantity)) {
    return null;
  }

  const newDiscounts = [...product.discounts, discount].sort(
    (a, b) => a.quantity - b.quantity
  );

  return {
    ...product,
    discounts: newDiscounts,
  };
}

/**
 * 상품에서 특정 수량의 할인 규칙을 제거합니다
 * @param product 상품
 * @param quantity 제거할 할인 규칙의 수량
 * @returns 할인 규칙이 제거된 상품
 */
export function removeProductDiscount(
  product: Product,
  quantity: number
): Product {
  return {
    ...product,
    discounts: product.discounts.filter((d) => d.quantity !== quantity),
  };
}

/**
 * 상품의 특정 수량에 대한 할인율을 가져옵니다
 * @param product 상품
 * @param quantity 수량
 * @returns 적용 가능한 최대 할인율 (0~1 사이 값)
 */
export function getProductDiscountRate(
  product: Product,
  quantity: number
): number {
  return product.discounts.reduce((maxRate, discount) => {
    return quantity >= discount.quantity && discount.rate > maxRate
      ? discount.rate
      : maxRate;
  }, 0);
}

/**
 * 상품의 할인 적용 후 단가를 계산합니다
 * @param product 상품
 * @param quantity 수량
 * @returns 할인 적용 후 단가
 */
export function getDiscountedPrice(product: Product, quantity: number): number {
  const discountRate = getProductDiscountRate(product, quantity);
  return Math.round(product.price * (1 - discountRate));
}

/**
 * 상품 목록에서 특정 ID의 상품을 찾습니다
 * @param products 상품 목록
 * @param productId 찾을 상품 ID
 * @returns 찾은 상품 또는 undefined
 */
export function findProductById(
  products: Product[],
  productId: string
): Product | undefined {
  return products.find((product) => product.id === productId);
}

/**
 * 상품 목록에서 특정 ID의 상품을 제거합니다
 * @param products 기존 상품 목록
 * @param productId 제거할 상품 ID
 * @returns 상품이 제거된 새로운 배열
 */
export function removeProductById(
  products: Product[],
  productId: string
): Product[] {
  return products.filter((product) => product.id !== productId);
}

/**
 * 상품 목록에서 특정 ID의 상품을 업데이트합니다
 * @param products 기존 상품 목록
 * @param productId 업데이트할 상품 ID
 * @param updates 업데이트할 정보
 * @returns 상품이 업데이트된 새로운 배열 또는 null (유효하지 않은 경우)
 */
export function updateProductInList(
  products: Product[],
  productId: string,
  updates: Partial<Omit<Product, "id">>
): Product[] | null {
  const product = findProductById(products, productId);
  if (!product) {
    return null;
  }

  const updatedProduct = updateProduct(product, updates);
  if (!updatedProduct) {
    return null;
  }

  return products.map((p) => (p.id === productId ? updatedProduct : p));
}

/**
 * 상품 목록에 새로운 상품을 추가합니다
 * @param products 기존 상품 목록
 * @param product 추가할 상품
 * @returns 상품이 추가된 새로운 배열
 */
export function addProductToList(
  products: Product[],
  product: Product
): Product[] {
  return [...products, product];
}

/**
 * 상품이 품절 임박 상태인지 확인합니다
 * @param product 상품
 * @param threshold 품절 임박 기준 (기본값: 5)
 * @returns 품절 임박이면 true, 그렇지 않으면 false
 */
export function isLowStock(product: Product, threshold: number = 5): boolean {
  return product.stock > 0 && product.stock <= threshold;
}

/**
 * 상품이 품절인지 확인합니다
 * @param product 상품
 * @returns 품절이면 true, 그렇지 않으면 false
 */
export function isOutOfStock(product: Product): boolean {
  return product.stock <= 0;
}

/**
 * 상품 목록에서 중복된 이름이 있는지 확인합니다
 * @param products 기존 상품 목록
 * @param name 확인할 상품 이름
 * @returns 중복되면 true, 그렇지 않으면 false
 */
export function isDuplicateProductName(
  products: Product[],
  name: string
): boolean {
  return products.some((product) => product.name.trim() === name.trim());
}

/**
 * 상품 업데이트 시 중복된 이름이 있는지 확인합니다 (자기 자신은 제외)
 * @param products 기존 상품 목록
 * @param productId 업데이트할 상품 ID
 * @param name 확인할 상품 이름
 * @returns 중복되면 true, 그렇지 않으면 false
 */
export function isDuplicateProductNameForUpdate(
  products: Product[],
  productId: string,
  name: string
): boolean {
  return products.some(
    (product) => product.id !== productId && product.name.trim() === name.trim()
  );
}

/**
 * 상품 목록에 새로운 상품을 추가합니다 (중복 체크 포함)
 * @param products 기존 상품 목록
 * @param product 추가할 상품
 * @returns 상품이 추가된 새로운 배열 또는 null (중복 이름인 경우)
 */
export function addProductToProducts(
  products: Product[],
  product: Product
): Product[] | null {
  if (isDuplicateProductName(products, product.name)) {
    return null;
  }

  return addProductToList(products, product);
}

/**
 * 상품 목록에서 특정 상품의 재고가 충분한지 확인합니다
 * @param products 상품 목록
 * @param productId 상품 ID
 * @param requestedQuantity 요청 수량
 * @returns 재고가 충분하면 true, 그렇지 않으면 false
 */
export function hasEnoughStock(
  products: Product[],
  productId: string,
  requestedQuantity: number
): boolean {
  const product = findProductById(products, productId);
  if (!product) {
    return false;
  }

  return product.stock >= requestedQuantity;
}

/**
 * 상품 목록에서 특정 상품의 재고를 업데이트합니다
 * @param products 상품 목록
 * @param productId 상품 ID
 * @param newStock 새로운 재고 수량
 * @returns 업데이트된 상품 목록 또는 null (상품을 찾을 수 없거나 유효하지 않은 재고인 경우)
 */
export function updateProductStockInList(
  products: Product[],
  productId: string,
  newStock: number
): Product[] | null {
  const product = findProductById(products, productId);
  if (!product) {
    return null;
  }

  const updatedProduct = updateProductStock(product, newStock);
  if (!updatedProduct) {
    return null;
  }

  return products.map((p) => (p.id === productId ? updatedProduct : p));
}

/**
 * 상품 목록에서 특정 상품에 할인 규칙을 추가합니다
 * @param products 상품 목록
 * @param productId 상품 ID
 * @param discount 추가할 할인 규칙
 * @returns 업데이트된 상품 목록 또는 null (상품을 찾을 수 없거나 유효하지 않은 할인인 경우)
 */
export function addProductDiscountToList(
  products: Product[],
  productId: string,
  discount: Discount
): Product[] | null {
  const product = findProductById(products, productId);
  if (!product) {
    return null;
  }

  const updatedProduct = addProductDiscount(product, discount);
  if (!updatedProduct) {
    return null;
  }

  return products.map((p) => (p.id === productId ? updatedProduct : p));
}

/**
 * 상품 목록에서 특정 상품의 할인 규칙을 제거합니다
 * @param products 상품 목록
 * @param productId 상품 ID
 * @param discountIndex 제거할 할인 규칙의 인덱스
 * @returns 업데이트된 상품 목록 또는 null (상품을 찾을 수 없거나 유효하지 않은 인덱스인 경우)
 */
export function removeProductDiscountFromList(
  products: Product[],
  productId: string,
  discountIndex: number
): Product[] | null {
  const product = findProductById(products, productId);
  if (!product) {
    return null;
  }

  if (discountIndex < 0 || discountIndex >= product.discounts.length) {
    return null;
  }

  const discountQuantity = product.discounts[discountIndex].quantity;
  const updatedProduct = removeProductDiscount(product, discountQuantity);

  return products.map((p) => (p.id === productId ? updatedProduct : p));
}
