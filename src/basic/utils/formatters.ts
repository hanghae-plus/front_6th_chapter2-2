// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatPrice(price: number): string - 가격을 한국 원화 형식으로 포맷
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷
// - formatPercentage(rate: number): string - 소수를 퍼센트로 변환 (0.1 → 10%)

// TODO: 구현

interface FormatPriceOptions {
  isAdmin: boolean;
  isSoldOut: boolean;
}

const formatters = {
  soldOut: () => 'SOLD OUT',
  admin: (price: number) => `${price.toLocaleString()}원`,
  user: (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  },
} as const;

export const formatPrice = (price: number, options: FormatPriceOptions): string => {
  const { isAdmin, isSoldOut } = options;

  return isSoldOut ? formatters.soldOut() : formatters[isAdmin ? 'admin' : 'user'](price);
};
