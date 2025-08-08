/**
 * 일반 사용자용 가격 포맷팅 (순수 함수)
 */
export const formatUserPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

/**
 * 관리자용 가격 포맷팅 (순수 함수)
 */
export const formatAdminPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

/**
 * 품절 표시 상수
 */
export const SOLD_OUT_TEXT = "SOLD OUT";
