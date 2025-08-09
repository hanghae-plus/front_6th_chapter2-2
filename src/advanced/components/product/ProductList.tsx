import React, { useCallback } from "react";

import { Product } from "../../../types";
import { getRefinedProduct } from "../../utils/productUtils";
import { displayPrice } from "../../utils/formatters";
import { getRemainingStock } from "../../utils/cartUtils";
import useFilterSearchParams from "../../../hooks/useFilterSearchParams";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { useNotifications } from "../../hooks/useNotifications";
import { ImageIcon } from "../icons";

export const ProductList: React.FC = () => {
  const { products, filteredProducts } = useProducts();
  const { cart, addToCart } = useCart();
  const { addNotification } = useNotifications();
  const { filterSearchParams } = useFilterSearchParams();

  const handleAddToCart = useCallback(
    (product: Product) => {
      if (!getRemainingStock(product, cart)) {
        addNotification("재고가 부족합니다", "error");
        return;
      }

      addToCart(product, 1);

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addToCart, addNotification]
  );

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{filterSearchParams.searchTerm ?? ""}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const refinedProduct = getRefinedProduct(product, cart);

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* 상품 이미지 영역 (placeholder) */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-24 h-24 text-gray-300" />
                  </div>
                  {product.isRecommended && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      BEST
                    </span>
                  )}
                  {product.discounts.length > 0 && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}
                      %
                    </span>
                  )}
                </div>

                {/* 상품 정보 */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* 가격 정보 */}
                  <div className="mb-3">
                    <p className="text-lg font-bold text-gray-900">
                      {displayPrice(refinedProduct, {
                        prefix: "₩",
                      })}
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
                    {refinedProduct.stock <= 5 && refinedProduct.stock > 0 && (
                      <p className="text-xs text-red-600 font-medium">
                        품절임박! {refinedProduct.stock}개 남음
                      </p>
                    )}
                    {refinedProduct.stock > 5 && (
                      <p className="text-xs text-gray-500">
                        재고 {refinedProduct.stock}개
                      </p>
                    )}
                  </div>

                  {/* 장바구니 버튼 */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={refinedProduct.stock <= 0}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      refinedProduct.stock <= 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {refinedProduct.stock <= 0 ? "품절" : "장바구니 담기"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
