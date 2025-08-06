// 포맷팅 유틸리티 함수들
// 원본에서 분리된 함수:
// - formatPrice(price: number, productId?: string, isAdmin?: boolean, products?: any[], cart?: any[]): string - 가격을 한국 원화 형식으로 포맷

import { ProductWithUI, CartItem } from '../../../types';
import { getRemainingStock } from '../models/cart';

// 가격을 한국 원화 형식으로 포맷 (원본과 동일한 로직)
export const formatPrice = (
  price: number, 
  productId?: string, 
  isAdmin?: boolean, 
  products?: ProductWithUI[], 
  cart?: CartItem[]
): string => {
  if (productId && products && cart) {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product, cart) <= 0) {
      return 'SOLD OUT';
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};