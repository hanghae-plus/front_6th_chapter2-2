// src/basic/utils/formatters.ts

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()}원`;
};
