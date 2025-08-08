//import React from "react";
import { ProductWithUI } from "../../types";
import { ImageIcon } from "./icons";
// ✅ 비즈니스 로직 import
import {
  getProductBadgeInfo,
  getStockDisplayInfo,
  shouldShowDiscountInfo,
  getDiscountDisplayText,
  getMaxDiscountRate,
} from "../models/product";

interface ProductPageProps {
  // 데이터 props
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;

  // 이벤트 핸들러 props
  onAddToCart: (product: ProductWithUI) => void;
  getRemainingStock: (product: ProductWithUI) => number;
  formatPrice: (price: number, productId?: string) => string;
}

export function ProductPage({
  products,
  filteredProducts,
  debouncedSearchTerm,
  onAddToCart,
  getRemainingStock,
  formatPrice,
}: ProductPageProps) {
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
              const remainingStock = getRemainingStock(product);

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
                        {formatPrice(product.price, product.id)}
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
                      onClick={() => onAddToCart(product)}
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
