// 검증 유틸리티 함수들
// 원본에서 분리된 함수들:
// - isValidPrice(price: number): boolean - 가격 검증 (양수)
// - isValidStock(stock: number): boolean - 재고 수량 검증 (0 이상, 9999 이하)
// - extractNumbers(value: string): string - 문자열에서 숫자만 추출

// 가격 검증 (양수)
export const isValidPrice = (price: number): boolean => {
  return price > 0;
};

// 재고 수량 검증 (0 이상, 9999 이하)
export const isValidStock = (stock: number): boolean => {
  return stock >= 0 && stock <= 9999;
};

// 문자열에서 숫자만 추출
export const extractNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};