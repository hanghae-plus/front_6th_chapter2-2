/**
 * 기본 가격 포맷팅 (고객용)
 */
export const formatPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

/**
 * 관리자용 가격 포맷팅
 */
export const formatAdminPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

/**
 * 재고 상태를 확인하여 가격 또는 품절 메시지 반환
 */
export const formatPriceWithStock = (price: number, remainingStock: number, isAdmin: boolean = false): string => {
  if (remainingStock <= 0) {
    return "SOLD OUT";
  }

  return isAdmin ? formatAdminPrice(price) : formatPrice(price);
};

/**
 * 할인율을 백분율로 포맷팅
 */
export const formatDiscountRate = (rate: number): string => {
  return `${(rate * 100).toFixed(0)}%`;
};

/**
 * 통화 형식으로 포맷팅
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()}원`;
};

/**
 * 숫자를 한국어 형식으로 포맷팅
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString("ko-KR");
};

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("ko-KR");
};
