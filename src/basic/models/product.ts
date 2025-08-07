import { ProductWithUI } from '../../types';

// 상품 비즈니스 로직 (순수 함수)

// 추천 상품 여부 확인
export const isRecommended = (product: ProductWithUI): boolean => {
  return product.isRecommended || false;
};
