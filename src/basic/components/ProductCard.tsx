import { ImageIcon } from './icons';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';
import { ProductWithUI, CartItem } from '../../types';
import { getMaxDiscountRate, formatDiscountDescription } from '../models/discount';
import { isRecommended } from '../models/product';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({
  product,
  isAdmin,
  products,
  cart,
  handleAddToCart,
  remainingStock,
}: {
  product: ProductWithUI;
  isAdmin: boolean;
  products: ProductWithUI[];
  cart: CartItem[];
  handleAddToCart: (product: ProductWithUI) => void;
  remainingStock: number;
}) => {
  return (
    <Card
      key={product.id}
      padding='none'
      className='overflow-hidden hover:shadow-lg transition-shadow'
    >
      {/* 상품 이미지 영역 (placeholder) */}
      <div className='relative'>
        <div className='aspect-square bg-gray-100 flex items-center justify-center'>
          <ImageIcon />
        </div>
        {isRecommended(product) && (
          <Badge
            size='xs'
            rounded='sm'
            className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1'
          >
            BEST
          </Badge>
        )}
        {product.discounts.length > 0 && (
          <Badge
            size='xs'
            rounded='sm'
            className='absolute top-2 left-2 bg-orange-500 text-white px-2 py-1'
          >
            ~{getMaxDiscountRate(product.discounts)}%
          </Badge>
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
            {formatPrice(product.price, product.id, isAdmin, products, cart)}
          </p>
          {product.discounts.length > 0 && (
            <p className='text-xs text-gray-500'>{formatDiscountDescription(product.discounts)}</p>
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
          onClick={() => handleAddToCart(product)}
          disabled={remainingStock <= 0}
          hasFontMedium
          hasTransition
          hasRounded
          className={`w-full py-2 px-4 rounded-md ${
            remainingStock <= 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {remainingStock <= 0 ? '품절' : '장바구니 담기'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
