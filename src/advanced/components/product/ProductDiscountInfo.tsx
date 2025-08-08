import { ProductWithUI } from '../../../types';

interface ProductDiscountInfoProps {
  product: ProductWithUI;
}

export const ProductDiscountInfo = ({ product }: ProductDiscountInfoProps) => {
  if (product.discounts.length === 0) return null;

  const firstDiscount = product.discounts[0];

  return (
    <p className="text-xs text-gray-500">
      {firstDiscount.quantity}개 이상 구매시 할인 {firstDiscount.rate * 100}%
    </p>
  );
};
