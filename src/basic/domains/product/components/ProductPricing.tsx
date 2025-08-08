import type { Product } from "../../../../types";

type ProductPricingProps = {
  product: Product;
  formatPrice: (price: number, productId?: string) => string;
};

export function ProductPricing({ product, formatPrice }: ProductPricingProps) {
  return (
    <div className="mb-3">
      <p className="text-lg font-bold text-gray-900">{formatPrice(product.price, product.id)}</p>
      {product.discounts.length > 0 && (
        <p className="text-xs text-gray-500">
          {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
        </p>
      )}
    </div>
  );
}
