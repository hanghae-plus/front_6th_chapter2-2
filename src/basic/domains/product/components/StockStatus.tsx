import { tv } from "tailwind-variants";

type StockStatusProps = {
  remainingStock: number;
  className?: string;
};

const LOW_STOCK_THRESHOLD = 5;

const stockStatusText = tv({
  base: "text-xs",
  variants: {
    tone: {
      normal: "text-gray-500",
      low: "font-medium text-red-600"
    }
  },
  defaultVariants: {
    tone: "normal"
  }
});

export function StockStatus({ remainingStock, className }: StockStatusProps) {
  if (remainingStock <= 0) return null;

  const tone = remainingStock <= LOW_STOCK_THRESHOLD ? "low" : "normal";
  const text = tone === "low" ? `품절임박! ${remainingStock}개 남음` : `재고 ${remainingStock}개`;

  return <p className={stockStatusText({ tone, className })}>{text}</p>;
}
