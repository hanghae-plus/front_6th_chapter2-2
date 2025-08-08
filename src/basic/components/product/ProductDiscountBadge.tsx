import { ProductWithUI } from '../../../types';

interface ProductDiscountBadgeProps {
  product: ProductWithUI;
}

export const ProductDiscountBadge = ({ product }: ProductDiscountBadgeProps) => {
  if (product.discounts.length === 0) return null;

  const maxDiscountRate = Math.max(...product.discounts.map((d) => d.rate));

  return (
    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
      ~{maxDiscountRate * 100}%
    </span>
  );
};
