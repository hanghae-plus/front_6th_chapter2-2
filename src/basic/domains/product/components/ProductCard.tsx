import { Button } from "../../../shared";
import type { ProductWithUI } from "../types";
import { ProductImage } from "./ProductImage";
import { StockStatus } from "./StockStatus";

type ProductCardProps = {
  product: ProductWithUI;
  remainingStock: number;
  formatPrice: (price: number, productId?: string) => string;
  onAddToCart: (product: ProductWithUI) => void;
};

export function ProductCard({
  product,
  remainingStock,
  formatPrice,
  onAddToCart
}: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <ProductImage product={product} />

      <div className="p-4">
        <h3 className="mb-1 font-medium text-gray-900">{product.name}</h3>
        {product.description && (
          <p className="mb-2 line-clamp-2 text-sm text-gray-500">{product.description}</p>
        )}

        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(product.price, product.id)}
          </p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        <div className="mb-3">
          <StockStatus remainingStock={remainingStock} />
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={remainingStock <= 0}
          color={remainingStock <= 0 ? "secondary" : "dark"}
          className="w-full"
        >
          {remainingStock <= 0 ? "품절" : "장바구니 담기"}
        </Button>
      </div>
    </div>
  );
}
