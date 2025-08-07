/**
 * 관리자용 가격 포맷팅 (원 단위)
 */
export const formatAdminPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

/**
 * 사용자용 가격 포맷팅 (₩ 기호)
 */
export const formatUserPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

/**
 * 원화 단위 포맷팅 (원 표시)
 */
export const formatKoreanWon = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

/**
 * 퍼센트를 소수로 변환
 */
export const percentToDecimal = (percent: number): number => percent / 100;
