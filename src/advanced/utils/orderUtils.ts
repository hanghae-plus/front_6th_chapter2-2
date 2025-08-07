/** 주문 번호 생성 */
export const generateOrderNumber = (): string => {
  return `ORD-${Date.now()}`;
};
