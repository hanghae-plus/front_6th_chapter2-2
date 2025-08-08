// 곱셈 계산
export const multiply = (a: number, b: number): number => a * b;

// 할인율 계산
export const calculatePercentageChange = (
  originalAmount: number,
  discountedAmount: number
): number => {
  if (originalAmount === 0) return 0;

  return Math.round((1 - discountedAmount / originalAmount) * 100);
};

// 할인율 적용
export const applyPercentage = (
  amount: number,
  discountPercent: number
): number => {
  return Math.round(amount * (1 - discountPercent / 100));
};
