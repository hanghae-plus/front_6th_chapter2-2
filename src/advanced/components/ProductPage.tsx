import { useAtomValue } from "jotai";
import { ImageIcon } from "./icons";

// ✅ Jotai atoms import
import {
  productsAtom,
  filteredProductsAtom,
  debouncedSearchTermAtom,
  formatPriceAtom,
} from "../atoms";

// ✅ Jotai hooks import
import { useCartJotai } from "../hooks/useCart";
import { useNotificationJotai } from "../hooks/useNotification";

// ✅ 비즈니스 로직 import
import {
  getProductBadgeInfo,
  getStockDisplayInfo,
  shouldShowDiscountInfo,
  getDiscountDisplayText,
  getMaxDiscountRate,
} from "../models/product";

// 🚀 Props 완전 제거!
export function ProductPage() {
  // ✅ 전역 상태에서 직접 가져오기
  const products = useAtomValue(productsAtom);
  const filteredProducts = useAtomValue(filteredProductsAtom);
  const debouncedSearchTerm = useAtomValue(debouncedSearchTermAtom);
  const formatPrice = useAtomValue(formatPriceAtom);

  // ✅ 전역 hooks 사용
  const notifications = useNotificationJotai();
  const cart = useCartJotai({
    addNotification: notifications.addNotification,
  });

  return (
    <div className="lg:col-span-3">
      {/* 상품 목록 */}
      <section>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
          <div className="text-sm text-gray-600">
            총 {products.length}개 상품
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              // ✅ cart hook에서 직접 가져오기
              const remainingStock = cart.getRemainingStock(product.id);

              const badgeInfo = getProductBadgeInfo(product);
              const stockInfo = getStockDisplayInfo(remainingStock);
              const discountInfo = shouldShowDiscountInfo(product)
                ? getDiscountDisplayText(product.discounts[0])
                : null;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <ImageIcon
                        className="w-16 h-16 text-gray-400"
                        strokeWidth={2}
                      />
                    </div>

                    {badgeInfo.showRecommended && (
                      <span
                        className={`absolute top-2 right-2 ${badgeInfo.recommendedStyle}`}
                      >
                        {badgeInfo.recommendedText}
                      </span>
                    )}

                    {badgeInfo.showDiscount && (
                      <span
                        className={`absolute top-2 left-2 ${badgeInfo.discountStyle}`}
                      >
                        ~{getMaxDiscountRate(product)}%
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="mb-3">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price, product.id)}{" "}
                        {/* ✅ atom에서 직접 사용 */}
                      </p>

                      {discountInfo && (
                        <p className="text-xs text-gray-500">{discountInfo}</p>
                      )}
                    </div>

                    <div className="mb-3">
                      {stockInfo.shouldShow && (
                        <p
                          className={`text-xs font-medium ${stockInfo.textColor}`}
                        >
                          {stockInfo.message}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => cart.addToCart(product)}
                      disabled={stockInfo.isOutOfStock}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        stockInfo.isOutOfStock
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {stockInfo.isOutOfStock ? "품절" : "장바구니 담기"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
