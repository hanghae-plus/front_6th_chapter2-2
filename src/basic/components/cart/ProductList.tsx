import { ProductImageIcon } from "../icons";
import { ProductWithUI } from "../../type/types";
import { getDisplayPrice } from "../../utils/price";
import { useDebounce } from "../../utils/hooks/useDebounce";

interface ProductListProps {
  products: ProductWithUI[];
  searchTerm: string;
  addToCart: (product: ProductWithUI) => void;
  getRemainingStock: (product: ProductWithUI) => number;
  isAdmin: boolean;
}

export function ProductList({
  products,
  searchTerm,
  addToCart,
  getRemainingStock,
  isAdmin,
}: ProductListProps) {
  // 검색어 디바운싱 적용 (300ms 지연)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
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

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* 상품 이미지 영역 (placeholder) */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <ProductImageIcon className="w-24 h-24 text-gray-300" />
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
                      {getDisplayPrice(
                        product,
                        isAdmin,
                        getRemainingStock(product)
                      )}
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
                      <p className="text-xs text-gray-500">
                        재고 {remainingStock}개
                      </p>
                    )}
                  </div>

                  {/* 장바구니 버튼 */}
                  <button
                    onClick={() => addToCart(product)}
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
          })}
        </div>
      )}
    </section>
  );
}
