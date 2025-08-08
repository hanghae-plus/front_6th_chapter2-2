export const calculateRemainingStock = (
  totalStock: number,
  usedQuantity: number
): number => {
  return totalStock - usedQuantity;
};

export const isInStock = (
  totalStock: number,
  usedQuantity: number = 0
): boolean => {
  return calculateRemainingStock(totalStock, usedQuantity) > 0;
};

export const getStockDisplay = (
  totalStock: number,
  usedQuantity: number = 0
): string => {
  return calculateRemainingStock(totalStock, usedQuantity) <= 0
    ? "SOLD OUT"
    : "";
};
