import type { Product } from "../../../../types";
import { ImagePlaceholderIcon } from "../../../shared";

type ProductImageProps = {
  product: Product & { isRecommended?: boolean };
};

export function ProductImage({ product }: ProductImageProps) {
  const maxDiscountRate =
    product.discounts.length > 0 ? Math.max(...product.discounts.map((d) => d.rate)) * 100 : 0;

  return (
    <div className="relative">
      <div className="flex aspect-square items-center justify-center bg-gray-100">
        <ImagePlaceholderIcon className="h-24 w-24 text-gray-300" />
      </div>

      {product.isRecommended && (
        <span className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
          BEST
        </span>
      )}
      {product.discounts.length > 0 && (
        <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-1 text-xs text-white">
          ~{maxDiscountRate}%
        </span>
      )}
    </div>
  );
}
