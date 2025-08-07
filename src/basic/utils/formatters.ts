// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatPrice(price: number): string - 가격을 한국 원화 형식으로 포맷
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷
// - formatPercentage(rate: number): string - 소수를 퍼센트로 변환 (0.1 → 10%)

// TODO: 구현

export const formatPrice = (price: number) => {
  return price.toLocaleString();
};

export const formatDate = (date: Date) => {
  return [
    date.getFullYear(),
    to2Digits(date.getMonth() + 1),
    to2Digits(date.getDate()),
  ].join("-");
};

export const formatPercentage = (rate: number) => {
  return `${rate * 100}%`;
};

const to2Digits = (n: number) => n.toString().padStart(2, "0");
