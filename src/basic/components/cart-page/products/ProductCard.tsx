import type { CartItem, Product, ProductWithUI } from '../../../../types';
import * as discountModel from '../../../models/discount';
import * as productModel from '../../../models/product';
import { formatNumberKRW, formatNumberRate } from '../../../utils/formatters';

interface Props {
  cart: CartItem[];
  addToCart: (params: { product: Product }) => void;
  product: ProductWithUI;
}

export function ProductCard({
  cart,
  addToCart,

  product,
}: Props) {
  const { name, description, discounts, isRecommended } = product;
  const maxDiscountRate = discountModel.getMaxDiscountRate({ discounts });
  const remainingStock = productModel.getRemainingStock({
    product,
    cart,
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 (placeholder) */}
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
        {isRecommended && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            BEST
          </span>
        )}
        {discounts.length > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~{formatNumberRate({ number: maxDiscountRate })}
          </span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            {productModel.formatPrice({
              cart,
              product,
              formatter: formatNumberKRW,
            })}
          </p>
          {discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {discounts[0].quantity}개 이상 구매시 할인{' '}
              {discounts[0].rate * 100}%
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
        <button
          onClick={() => {
            addToCart({ product });
          }}
          disabled={remainingStock <= 0}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            remainingStock <= 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {remainingStock <= 0 ? '품절' : '장바구니 담기'}
        </button>
      </div>
    </div>
  );
}
