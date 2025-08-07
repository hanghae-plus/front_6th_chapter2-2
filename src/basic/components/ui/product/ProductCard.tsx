import { Product } from '../../../../types';
import { ImageIcon } from '../../icons';
import { formatPrice } from '../../../utils/formatters';

interface ProductCardProps {
  product: Product;
  getRemainingStock: (product: Product) => number;
  addToCart: (product: Product) => void;
}

export const ProductCard = ({ product, getRemainingStock, addToCart }: ProductCardProps) => {
  const remainingStock = getRemainingStock(product);

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow'>
      <ProductImage product={product} />
      <ProductInfo product={product} remainingStock={remainingStock} addToCart={addToCart} />
    </div>
  );
};

// 상품 이미지 컴포넌트
const ProductImage = ({ product }: { product: Product }) => (
  <div className='relative'>
    <div className='aspect-square bg-gray-100 flex items-center justify-center'>
      <ImageIcon />
    </div>
    <ProductBadges product={product} />
  </div>
);

// 상품 배지 컴포넌트
const ProductBadges = ({ product }: { product: Product }) => (
  <>
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
  </>
);

// 상품 정보 컴포넌트
const ProductInfo = ({
  product,
  remainingStock,
  addToCart,
}: {
  product: Product;
  remainingStock: number;
  addToCart: (product: Product) => void;
}) => (
  <div className='p-4'>
    <ProductHeader product={product} />
    <ProductPrice product={product} />
    <ProductStock remainingStock={remainingStock} />
    <ProductAction product={product} remainingStock={remainingStock} addToCart={addToCart} />
  </div>
);

// 상품 헤더 (이름, 설명)
const ProductHeader = ({ product }: { product: Product }) => (
  <>
    <h3 className='font-medium text-gray-900 mb-1'>{product.name}</h3>
    {product.description && (
      <p className='text-sm text-gray-500 mb-2 line-clamp-2'>{product.description}</p>
    )}
  </>
);

// 상품 가격 정보
const ProductPrice = ({ product }: { product: Product }) => (
  <div className='mb-3'>
    <p className='text-lg font-bold text-gray-900'>{formatPrice(product.price)}</p>
    {product.discounts.length > 0 && (
      <p className='text-xs text-gray-500'>
        {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
      </p>
    )}
  </div>
);

// 상품 재고 정보
const ProductStock = ({ remainingStock }: { remainingStock: number }) => (
  <div className='mb-3'>
    {remainingStock <= 5 && remainingStock > 0 && (
      <p className='text-xs text-red-600 font-medium'>품절임박! {remainingStock}개 남음</p>
    )}
    {remainingStock > 5 && <p className='text-xs text-gray-500'>재고 {remainingStock}개</p>}
  </div>
);

// 상품 액션 버튼
const ProductAction = ({
  product,
  remainingStock,
  addToCart,
}: {
  product: Product;
  remainingStock: number;
  addToCart: (product: Product) => void;
}) => (
  <button
    onClick={() => addToCart(product)}
    disabled={remainingStock <= 0}
    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
      remainingStock <= 0
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-gray-900 text-white hover:bg-gray-800'
    }`}
  >
    {remainingStock <= 0 ? '품절' : '장바구니 담기'}
  </button>
);
