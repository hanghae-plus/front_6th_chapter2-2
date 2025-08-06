import { useProductHandlers } from "../../../entities/products/useProductHandlers";
import { useCartHandlers } from "../../../entities/cart/useCartHandlers";
import { useSearchProduct } from "../../../entities/products/useSearchProduct";
import { useProductUtils } from "../../../entities/products/useProductUtils";
import { useNotifications } from "../../../hooks/useNotifications";
import { productModel } from "../../../entities/products/product.model";
import { calculateRemainingStock } from "../../../utils/calculateRemainingStock";
import { formatPrice } from "../../../utils/formatters";
import { PhotoIcon } from "../../icons/PhotoIcon";
import { STOCK, DISCOUNT } from "../../../constants";

export const ProductListSection = () => {
  // Hooks를 직접 사용
  const { addNotification } = useNotifications();
  const productHandlers = useProductHandlers({ addNotification });
  const cartHandlers = useCartHandlers({ addNotification });
  const searchProduct = useSearchProduct();

  const productUtils = useProductUtils({
    products: productHandlers.state.items,
    cart: cartHandlers.state.items,
  });

  // 필터링된 상품 계산
  const filteredProducts = productModel.searchProducts(
    productHandlers.state.items,
    searchProduct.debouncedSearchTerm
  );

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">
          총 {productHandlers.state.items.length}개 상품
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{searchProduct.debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const remainingStock = calculateRemainingStock(
              product,
              cartHandlers.state.items
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* 상품 이미지 영역 (placeholder) */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <PhotoIcon />
                  </div>
                  {product.isRecommended && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      BEST
                    </span>
                  )}
                  {product.discounts.length > 0 && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      ~
                      {Math.max(...product.discounts.map((d) => d.rate)) *
                        DISCOUNT.PERCENTAGE_BASE}
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
                      {formatPrice(
                        product.price,
                        productUtils.checkSoldOutByProductId(product.id)
                      )}
                    </p>
                    {product.discounts.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {product.discounts[0].quantity}개 이상 구매시 할인{" "}
                        {product.discounts[0].rate * DISCOUNT.PERCENTAGE_BASE}%
                      </p>
                    )}
                  </div>

                  {/* 재고 상태 */}
                  <div className="mb-3">
                    {remainingStock <= STOCK.LOW_STOCK_THRESHOLD &&
                      remainingStock > 0 && (
                        <p className="text-xs text-red-600 font-medium">
                          품절임박! {remainingStock}개 남음
                        </p>
                      )}
                    {remainingStock > STOCK.LOW_STOCK_THRESHOLD && (
                      <p className="text-xs text-gray-500">
                        재고 {remainingStock}개
                      </p>
                    )}
                  </div>

                  {/* 장바구니 버튼 */}
                  <button
                    onClick={() => cartHandlers.actions.add(product)}
                    disabled={productUtils.checkSoldOutByProductId(product.id)}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      productUtils.checkSoldOutByProductId(product.id)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {productUtils.checkSoldOutByProductId(product.id)
                      ? "품절"
                      : "장바구니 담기"}
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
