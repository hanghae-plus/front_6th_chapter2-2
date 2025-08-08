type ItemPricingProps = {
  itemTotal: number;
  hasDiscount: boolean;
  discountRate: number;
};

export function ItemPricing({ itemTotal, hasDiscount, discountRate }: ItemPricingProps) {
  return (
    <div className="text-right">
      {hasDiscount && (
        <span className="block text-xs font-medium text-red-500">-{discountRate}%</span>
      )}
      <p className="text-sm font-medium text-gray-900">
        {Math.round(itemTotal).toLocaleString()}원
      </p>
    </div>
  );
}
