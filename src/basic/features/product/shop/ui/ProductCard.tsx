import { CartItem } from '../../../../../types';
import { ProductWithUI } from '../../../../entities/product';
import { Button } from '../../../../shared/ui';
import { formatPrice, getRemainingStock, getProductStockStatus } from '../../../../shared/utils';

interface ProductCardProps {
  product: ProductWithUI;
  cart: CartItem[];
  onAddToCart: (product: ProductWithUI) => void;
}

export default function ProductCard({
  product,
  cart,
  onAddToCart,
}: ProductCardProps) {
  // 장바구니에서 현재 상품 수량 찾기
  const cartQuantity = cart.find(item => item.product.id === product.id)?.quantity || 0;
  
  // 남은 재고 계산
  const remainingStock = getRemainingStock({
    stock: product.stock,
    cartQuantity
  });
  
  // 품절 상태 체크
  const stockStatus = getProductStockStatus({
    stock: product.stock,
    cartQuantity
  });
  
  // 가격 표시 함수
  const displayPrice = () => {
    if (stockStatus) return stockStatus;
    const formatted = formatPrice(product.price);
    return `₩${formatted}`;
  };
  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow'>
      {/* 상품 이미지 영역 (placeholder) */}
      <div className='relative'>
        <div className='aspect-square bg-gray-100 flex items-center justify-center'>
          <svg
            className='w-24 h-24 text-gray-300'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
        </div>
        {product.isRecommended && (
          <span className='absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded'>
            BEST
          </span>
        )}
        {product.discounts.length > 0 && (
          <span className='absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded'>
            ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
          </span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className='p-4'>
        <h3 className='font-medium text-gray-900 mb-1'>{product.name}</h3>
        {product.description && (
          <p className='text-sm text-gray-500 mb-2 line-clamp-2'>
            {product.description}
          </p>
        )}

        {/* 가격 정보 */}
        <div className='mb-3'>
          <p className='text-lg font-bold text-gray-900'>
            {displayPrice()}
          </p>
          {product.discounts.length > 0 && (
            <p className='text-xs text-gray-500'>
              {product.discounts[0].quantity}개 이상 구매시 할인{' '}
              {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className='mb-3'>
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className='text-xs text-red-600 font-medium'>
              품절임박! {remainingStock}개 남음
            </p>
          )}
          {remainingStock > 5 && (
            <p className='text-xs text-gray-500'>재고 {remainingStock}개</p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <Button
          onClick={() => onAddToCart(product)}
          disabled={remainingStock <= 0}
          variant='primary'
          className='w-full'
          size='md'
        >
          {remainingStock <= 0 ? '품절' : '장바구니 담기'}
        </Button>
      </div>
    </div>
  );
}
