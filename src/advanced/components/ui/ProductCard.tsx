import { useAtomValue } from 'jotai';
import { CartItem, ProductWithUI } from '../../../types';
import { getRemainingStock } from '../../utils/calculations/stockCalculations';
import { formatPriceWithSoldOut } from '../../utils/formatters/priceFormatter';
import Button from './Button';
import { ImageIcon } from './Icons';
import { isAdminAtom } from '../../atoms/uiAtoms';

interface ProductCardProps {
  product: ProductWithUI;
  remainingStock: number;
  addToCart: (product: ProductWithUI) => void;
  cart: CartItem[];
}

export default function ProductCard({
  product,
  cart,
  remainingStock,
  addToCart,
}: ProductCardProps) {
  const isAdmin = useAtomValue(isAdminAtom);

  return (
    <div
      key={product.id}
      className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow'
    >
      {/* 상품 이미지 영역 (placeholder) */}
      <div className='relative'>
        <div className='aspect-square bg-gray-100 flex items-center justify-center'>
          <ImageIcon />
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
          <p className='text-sm text-gray-500 mb-2 line-clamp-2'>{product.description}</p>
        )}

        {/* 가격 정보 */}
        <div className='mb-3'>
          <p className='text-lg font-bold text-gray-900'>
            {formatPriceWithSoldOut(product.price, isAdmin, getRemainingStock(product, cart) <= 0)}
          </p>
          {product.discounts.length > 0 && (
            <p className='text-xs text-gray-500'>
              {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className='mb-3'>
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className='text-xs text-red-600 font-medium'>품절임박! {remainingStock}개 남음</p>
          )}
          {remainingStock > 5 && <p className='text-xs text-gray-500'>재고 {remainingStock}개</p>}
        </div>

        {/* 장바구니 버튼 */}

        <Button
          variant='primary'
          size='lg'
          disabled={remainingStock <= 0}
          onClick={() => addToCart(product)}
          className='w-full'
        >
          {remainingStock <= 0 ? '품절' : '장바구니 담기'}
        </Button>
      </div>
    </div>
  );
}
