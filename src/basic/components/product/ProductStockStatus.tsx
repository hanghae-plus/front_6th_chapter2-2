interface ProductStockStatusProps {
  remainingStock: number;
}

export const ProductStockStatus = ({ remainingStock }: ProductStockStatusProps) => {
  if (remainingStock <= 5 && remainingStock > 0) {
    return <p className="text-xs text-red-600 font-medium">품절임박! {remainingStock}개 남음</p>;
  }

  if (remainingStock > 5) {
    return <p className="text-xs text-gray-500">재고 {remainingStock}개</p>;
  }

  return null;
};
