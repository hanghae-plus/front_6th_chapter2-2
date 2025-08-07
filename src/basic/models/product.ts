import { Product } from "../../types";
import { formatAdminPrice } from "../utils/formatters";
import { Discount, createEmptyDiscountList } from "./discount";
import { getStockStatus } from "../utils/validators";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
}

// ============================================================================
// 엔티티를 다루지 않는 함수
// ============================================================================

/**
 * 빈 상품 폼 데이터 생성
 */
export const createEmptyProductForm = (): ProductFormData => ({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: createEmptyDiscountList(),
});

/**
 * 상품 정보로부터 폼 데이터 생성
 */
export const createProductFormFromProduct = (
  product: ProductWithUI
): ProductFormData => ({
  name: product.name,
  price: product.price,
  stock: product.stock,
  description: product.description || "",
  discounts: product.discounts,
});

/**
 * 상품 ID로 상품 찾기
 */
export const findProductById = (
  products: Product[],
  productId: string
): Product | undefined => products.find((product) => product.id === productId);

/**
 * 관리자용 가격 포맷팅 (원 단위)
 */
export const formatPriceForAdmin = (product: ProductWithUI): string => {
  if (getStockStatus(product.stock) === "soldOut") return "SOLD OUT";
  return formatAdminPrice(product.price);
};

/**
 * 사용자용 가격 포맷팅 (₩ 기호)
 */
export const formatPriceForUser = (product: ProductWithUI): string => {
  if (getStockStatus(product.stock) === "soldOut") return "SOLD OUT";
  return `₩${product.price.toLocaleString()}`;
};

// ============================================================================
// 엔티티를 다루는 함수
// ============================================================================

/**
 * 상품 목록에서 특정 상품 제거
 */
export const removeProductFromList = (
  products: ProductWithUI[],
  productId: string
): ProductWithUI[] => products.filter((product) => product.id !== productId);

export const generateProductId = (date: number): string => `p${date}`;

export const createProduct = (
  newProduct: Omit<ProductWithUI, "id">,
  id: string
): ProductWithUI => ({
  id,
  ...newProduct,
});
