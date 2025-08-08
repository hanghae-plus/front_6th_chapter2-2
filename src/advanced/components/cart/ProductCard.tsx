import { ProductWithUI, SOLD_OUT_TEXT } from "../../App";
import { useCart, useCartActions } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { getRemainingStock } from "../../models/cart";
import { formatPrice, isProductSoldOut } from "../../utils/formatters";
import { ImageIcon } from "../icons";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface ProductCardProps {
  product: ProductWithUI;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const products = useProducts();
  const { cart } = useCart();
  const { addToCart } = useCartActions();
  const remainingStock = getRemainingStock(product, cart);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-24 h-24 text-gray-300" />
        </div>
        {product.isRecommended && (
          <Badge color="red" className="absolute top-2 right-2">
            BEST
          </Badge>
        )}
        {product.discounts.length > 0 && (
          <Badge color="orange" className="absolute top-2 left-2">
            ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
          </Badge>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            {isProductSoldOut(product.id, products, cart)
              ? SOLD_OUT_TEXT
              : `₩${formatPrice(product.price)}`}
          </p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인{" "}
              {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {remainingStock}개 남음
            </p>
          )}
          {remainingStock > 5 && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <Button
          onClick={() => addToCart(product)}
          disabled={remainingStock <= 0}
          sizes="lg"
          fullWidth
        >
          {remainingStock <= 0 ? "품절" : "장바구니 담기"}
        </Button>
      </div>
    </div>
  );
};
