export const formatPrice = (price: number, options: { isAdmin?: boolean } = {}): string => {
  const formattedNumber = price.toLocaleString('ko-KR');

  if (options.isAdmin) {
    return `${formattedNumber}원`;
  }
  return `₩${formattedNumber}`;
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatPercentage = (rate: number): string => {
  return `${rate * 100}%`;
};
