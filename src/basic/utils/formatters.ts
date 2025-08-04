// 가격을 한국 원화 형식으로 포맷
export const formatPrice = (
  price: number,
  productId?: string,
  isAdmin: boolean = false
): string => {
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};

// 날짜를 YYYY-MM-DD 형식으로 포맷
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 소수를 퍼센트로 변환 (0.1 → 10%)
export function formatPercentage(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
