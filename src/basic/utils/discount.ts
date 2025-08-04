// 할인 적용
export function applyDiscount({
  price,
  discount,
}: {
  price: number;
  discount: number;
}) {
  return Math.round(price * (1 - discount));
}
