import { tv } from "tailwind-variants";

const stockBadge = tv({
  base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    level: {
      high: "bg-green-100 text-green-800",
      low: "bg-yellow-100 text-yellow-800",
      out: "bg-red-100 text-red-800"
    }
  }
});

type StockBadgeProps = {
  stock: number;
};

export function StockBadge({ stock }: StockBadgeProps) {
  const level = stock > 10 ? "high" : stock > 0 ? "low" : "out";

  return <span className={stockBadge({ level })}>{stock}개</span>;
}
