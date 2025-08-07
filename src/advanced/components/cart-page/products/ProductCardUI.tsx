import { ImagePlaceholderIcon } from '../../icons';
import { Badge } from '../../ui/Badge';

interface ProductCardUIProps {
  name: string;
  description?: string;
  price: string;
  discountRate?: string;
  isRecommended: boolean;
  stockStatus: 'sufficient' | 'low' | 'out';
  remainingStock: number;
  onAddToCart: () => void;
}

export function ProductCardUI({
  name,
  description,
  price,
  discountRate,
  isRecommended,
  stockStatus,
  remainingStock,
  onAddToCart,
}: ProductCardUIProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <ImagePlaceholderIcon />
        </div>
        {isRecommended && (
          <Badge variant="error" className="absolute top-2 right-2">
            BEST
          </Badge>
        )}
        {discountRate && (
          <Badge variant="stock" className="absolute top-2 left-2">
            ~{discountRate}
          </Badge>
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
          <p className="text-lg font-bold text-gray-900">{price}</p>
          {discountRate && (
            <p className="text-xs text-gray-500">할인율: {discountRate}</p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {stockStatus === 'low' && (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {remainingStock}개 남음
            </p>
          )}
          {stockStatus === 'sufficient' && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <button
          onClick={onAddToCart}
          disabled={stockStatus === 'out'}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            stockStatus === 'out'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {stockStatus === 'out' ? '품절' : '장바구니 담기'}
        </button>
      </div>
    </div>
  );
}
