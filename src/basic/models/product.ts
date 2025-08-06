import { ProductWithUI } from '../../types';

// 상품 비즈니스 로직 (순수 함수)
// 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

// isRecommended(product: ProductWithUI): boolean - 추천 상품 여부 확인
export const isRecommended = (product: ProductWithUI): boolean => {
  return product.isRecommended || false;
};
