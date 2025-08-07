/**
 * 전체 재고에서 장바구니 수량을 뺀 남은 재고 계산
 * @param stock 전체 재고 수량
 * @param cartQuantity 장바구니에 담긴 수량
 * @returns 남은 재고 수량
 */
export const getRemainingStock = ({
  stock,
  cartQuantity,
}: {
  stock: number;
  cartQuantity: number;
}) => {
  return stock - cartQuantity;
};

/**
 * 재고 상태를 확인해서 품절 여부를 문자열로 반환
 * @param stock 전체 재고 수량
 * @param cartQuantity 장바구니에 담긴 수량
 * @returns 품절이면 "SOLD OUT", 아니면 빈 문자열
 */
export const getProductStockStatus = ({
  stock,
  cartQuantity,
}: {
  stock: number;
  cartQuantity: number;
}) => {
  return getRemainingStock({ stock, cartQuantity }) <= 0 ? 'SOLD OUT' : '';
};