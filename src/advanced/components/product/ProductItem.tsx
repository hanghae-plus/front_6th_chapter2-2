import { IProductWithUI } from "../../type";
import { formatPercentage, formatPrice } from "../../utils/formatters";
import { STOCK } from "../../constants/business";
import { MESSAGES } from "../../constants/messages";
import { ImageIcon } from "../icon";
import { useCart } from "../../hooks/useCart";
import { useNotification } from "../../hooks/useNotification";
import { useCallback } from "react";

interface ProductItemProps {
  product: IProductWithUI;
}

const ProductItem = ({ product }: ProductItemProps) => {
  const { addToCart, getRemainingStock } = useCart();
  const { addNotification } = useNotification();

  const remainingStock = getRemainingStock(product);

  // 가격 텍스트 처리
  const getPriceText = (item: IProductWithUI) => {
    if (item && getRemainingStock(item) <= 0) return MESSAGES.PRODUCT.SOLD_OUT;
    return formatPrice(item.price, "krw");
  };

  // 장바구니 담기 버튼 처리
  const addItemToCart = useCallback(
    (product: IProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification(MESSAGES.PRODUCT.OUT_OF_STOCK, "error");
        return;
      }

      addToCart(product);
      addNotification(MESSAGES.PRODUCT.ADDED_TO_CART, "success");
    },
    [addNotification, getRemainingStock]
  );

  return (
    <div
      key={product.id}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {/* 상품 이미지 아이콘 */}
          <ImageIcon />
        </div>
        {product.isRecommended && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            BEST
          </span>
        )}
        {product.discounts.length > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~
            {formatPercentage(
              Math.max(...product.discounts.map((d) => d.rate))
            )}
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
          <p className="text-lg font-bold text-gray-900">
            {getPriceText(product)}
          </p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인{" "}
              {formatPercentage(product.discounts[0].rate)}
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= STOCK.LOW_THRESHOLD && remainingStock > 0 && (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {remainingStock}개 남음
            </p>
          )}
          {remainingStock > 5 && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <button
          onClick={() => addItemToCart(product)}
          disabled={remainingStock <= 0}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            remainingStock <= 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {remainingStock <= 0 ? "품절" : "장바구니 담기"}
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
