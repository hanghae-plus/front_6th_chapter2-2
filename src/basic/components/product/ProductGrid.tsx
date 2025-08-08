import { ProductWithUI } from '../../../types';
import { ProductPrice, ProductStockStatus, ProductDiscountBadge, ProductDiscountInfo } from '.';

interface ProductGridProps {
  products: ProductWithUI[];
  remainingStock: (product: ProductWithUI) => number;
  onAddToCart: (product: ProductWithUI) => void;
}

export function ProductGrid({ products, remainingStock, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const stock = remainingStock(product);

        return (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* 상품 이미지 영역 */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {product.isRecommended && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  BEST
                </span>
              )}
              <ProductDiscountBadge product={product} />
            </div>

            {/* 상품 정보 */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
              )}

              {/* 가격 정보 */}
              <div className="mb-3">
                <p className="text-lg font-bold text-gray-900">
                  <ProductPrice product={product} isAdmin={false} remainingStock={stock} />
                </p>
                <ProductDiscountInfo product={product} />
              </div>

              {/* 재고 상태 */}
              <div className="mb-3">
                <ProductStockStatus remainingStock={stock} />
              </div>

              {/* 장바구니 버튼 */}
              <button
                onClick={() => onAddToCart(product)}
                disabled={stock <= 0}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  stock <= 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {stock <= 0 ? '품절' : '장바구니 담기'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
