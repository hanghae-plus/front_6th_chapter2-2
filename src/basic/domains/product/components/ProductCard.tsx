import type { Product } from "../../../../types";
import { Button } from "../../../shared";
import { ProductImage } from "./ProductImage";
import { ProductInfo } from "./ProductInfo";
import { ProductPricing } from "./ProductPricing";
import { StockStatus } from "./StockStatus";

type ProductWithUI = Product & {
  description?: string;
  isRecommended?: boolean;
};

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
        <ProductInfo name={product.name} description={product.description} />
        <ProductPricing product={product} formatPrice={formatPrice} />
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
