// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatPrice(price: number): string - 가격을 한국 원화 형식으로 포맷
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷
// - formatPercentage(rate: number): string - 소수를 퍼센트로 변환 (0.1 → 10%)

// TODO: 구현

export function numberFormat({
  options,
  number,
}: {
  number: number;
  options: Intl.NumberFormatOptions;
}) {
  return Intl.NumberFormat('ko-KR', options).format(number);
}

export function formatNumberKRW({ number }: { number: number }) {
  return numberFormat({
    options: { style: 'currency', currency: 'KRW' },
    number,
  });
}

export function formatNumberWon({ number }: { number: number }) {
  return `${numberFormat({
    options: { style: 'decimal' },
    number,
  })}원`;
}

export function formatNumberRate({ number }: { number: number }) {
  return numberFormat({
    options: { style: 'percent' },
    number,
  });
}
