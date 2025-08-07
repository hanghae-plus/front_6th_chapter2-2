import { ProductWithUI } from "../../App";
import { DefaultImageIcon } from "../icons";
import { Button, PriceDisplay } from "../ui";
import {
  getMaxDiscountPercentage,
  getStockStatusText,
  getProductButtonText,
  getProductButtonVariant,
} from "../../utils/productUtils";

interface ProductItemProps {
  product: ProductWithUI;
  remainingStock: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  addToCart: (product: ProductWithUI) => void;
}

export default function ProductItem({
  product,
  remainingStock,
  isLowStock,
  isOutOfStock,
  addToCart,
}: ProductItemProps) {
  return (
    <div
      key={product.id}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 상품 이미지 영역 */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <DefaultImageIcon className="w-24 h-24 text-gray-300" />
        </div>
        {product.isRecommended && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            BEST
          </span>
        )}
        {product.discounts.length > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~{getMaxDiscountPercentage(product)}%
          </span>
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
          {isOutOfStock ? (
            <p className="text-lg font-bold text-gray-400">SOLD OUT</p>
          ) : (
            <PriceDisplay
              price={product.price}
              size="large"
              className="text-left"
            />
          )}
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인{" "}
              {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {isLowStock && (
            <p className="text-xs text-red-600 font-medium">
              {getStockStatusText(remainingStock, isLowStock)}
            </p>
          )}
          {remainingStock > 5 && !isLowStock && (
            <p className="text-xs text-gray-500">
              {getStockStatusText(remainingStock, isLowStock)}
            </p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <Button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          variant={getProductButtonVariant(isOutOfStock)}
          className="w-full"
        >
          {getProductButtonText(isOutOfStock)}
        </Button>
      </div>
    </div>
  );
}
