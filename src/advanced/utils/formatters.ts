/** 가격을 한국 원화 형식으로 포맷 (10000 -> "10,000원") */
export const formatPrice = (price: number): string => `${price.toLocaleString()}원`;

/** 소수 비율을 퍼센트 문자열로 포맷 (0.1 -> "10%") */
export const formatPercentage = (rate: number): string => `${Math.round(rate * 100)}%`;
