import { priceUtils } from "../../utils/priceUtils";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  showDiscount?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function PriceDisplay({
  price,
  originalPrice,
  showDiscount = true,
  size = "medium",
  className = "",
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountRate = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <div className={`text-right ${className}`}>
      {showDiscount && hasDiscount && (
        <span className="text-xs text-red-500 font-medium block">
          -{discountRate}%
        </span>
      )}
      <p className={`font-medium text-gray-900 ${sizeClasses[size]}`}>
        {priceUtils.formatCurrency(Math.round(price), false)}
      </p>
    </div>
  );
}
