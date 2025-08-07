const formatPriceAtCart = (price: number, remainingStock: number): string => {
  if (remainingStock <= 0) return "SOLD OUT";
  return `${price.toLocaleString()}원`;
};

const formatPriceAtAdmin = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};

export { formatPriceAtCart, formatPriceAtAdmin, formatPercentage };
