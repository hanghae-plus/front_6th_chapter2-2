import { CartItem } from "../../types";

// 적용 가능한 최대 할인율 계산
export function getMaxApplicableDiscount(item: CartItem): number {
  const { discounts } = item.product;
  const { quantity } = item;
  return discounts.reduce(
    (max, d) => (quantity >= d.quantity && d.rate > max ? d.rate : max),
    0
  );
}
