export const formatPrice = (
  price: number,
  isSoldOut: boolean = false,
  isAdmin: boolean = false
): string => {
  if (isSoldOut) {
    return 'SOLD OUT';
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  // 테스트에서 기대하는 형식으로 변경
  return `${price.toLocaleString()}원`;
};
