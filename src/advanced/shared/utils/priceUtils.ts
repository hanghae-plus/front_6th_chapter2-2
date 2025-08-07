/**
 * 숫자를 천 단위 구분자가 있는 문자열로 포맷팅
 * @param price 포맷팅할 가격
 * @returns 천 단위 구분자가 포함된 문자열 (예: "10,000")
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString();
};