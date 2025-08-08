import { Product } from "../../../types";
import { formatPrice } from "../../utils/formatters";
import { Button } from "../ui/button/Button";

interface ProductCardProps {
  product: Product;
  getRemainingStock: (product: Product) => number;
  addToCart: (product: Product) => void;
}

export const ProductCard = ({ product, getRemainingStock, addToCart }: ProductCardProps) => {
  const remainingStock = getRemainingStock(product);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <ProductImage product={product} />
      <ProductInfo product={product} remainingStock={remainingStock} addToCart={addToCart} />
    </div>
  );
};

// 상품 이미지 컴포넌트
const ProductImage = ({ product }: { product: Product }) => (
  <div className="relative">
    <div className="aspect-square bg-gray-100 flex items-center justify-center">
      <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
    <ProductBadges product={product} />
  </div>
);

// 상품 배지 컴포넌트
const ProductBadges = ({ product }: { product: Product }) => (
  <>
    {product.isRecommended && (
      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">BEST</span>
    )}
    {product.discounts.length > 0 && (
      <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
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
  <div className="p-4">
    <ProductHeader product={product} />
    <ProductPrice product={product} />
    <ProductStock remainingStock={remainingStock} />
    <ProductAction product={product} remainingStock={remainingStock} addToCart={addToCart} />
  </div>
);

// 상품 헤더 (이름, 설명)
const ProductHeader = ({ product }: { product: Product }) => (
  <>
    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
    {product.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>}
  </>
);

// 상품 가격 정보
const ProductPrice = ({ product }: { product: Product }) => (
  <div className="mb-3">
    <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
    {product.discounts.length > 0 && (
      <p className="text-xs text-gray-500">
        {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
      </p>
    )}
  </div>
);

// 상품 재고 정보
const ProductStock = ({ remainingStock }: { remainingStock: number }) => (
  <div className="mb-3">
    {remainingStock <= 5 && remainingStock > 0 && (
      <p className="text-xs text-red-600 font-medium">품절임박! {remainingStock}개 남음</p>
    )}
    {remainingStock > 5 && <p className="text-xs text-gray-500">재고 {remainingStock}개</p>}
  </div>
);

// 상품 액션 버튼 - UI 컴포넌트 사용
const ProductAction = ({
  product,
  remainingStock,
  addToCart,
}: {
  product: Product;
  remainingStock: number;
  addToCart: (product: Product) => void;
}) => {
  const isOutOfStock = remainingStock <= 0;

  return (
    <Button
      variant={isOutOfStock ? "ghost" : "primary"}
      size="md"
      className="w-full"
      disabled={isOutOfStock}
      onClick={() => addToCart(product)}
    >
      {isOutOfStock ? "품절" : "장바구니 담기"}
    </Button>
  );
};
