import { Product } from '../../types';

// 관리자용 가격 포맷팅 (원 단위)
export const formatAdminPrice = (
  price: number,
  product?: Product,
  getRemainingStock?: (product: Product) => number
): string => {
  if (product && getRemainingStock && getRemainingStock(product) <= 0) {
    return 'SOLD OUT';
  }
  return `${price.toLocaleString()}원`;
};

// 고객용 가격 포맷팅 (₩ 단위)
export const formatCustomerPrice = (
  price: number,
  product?: Product,
  getRemainingStock?: (product: Product) => number
): string => {
  if (product && getRemainingStock && getRemainingStock(product) <= 0) {
    return 'SOLD OUT';
  }
  return `₩${price.toLocaleString()}`;
};

// 일반적인 가격 포맷팅 (단위 없이)
export const formatPrice = (price: number): string => {
  return price.toLocaleString();
};
