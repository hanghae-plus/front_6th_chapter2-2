import { useCart } from "@/basic/features/cart/hooks/useCart";
import { cartModel } from "@/basic/features/cart/models/cart.model";
import { discountModel } from "@/basic/features/discount/models/discount.model";
import { Discount } from "@/basic/features/discount/types/discount.type";
import { AddNotification } from "@/basic/features/notification/types/notification";
import { useProducts } from "@/basic/features/product/hooks/useProducts";
import { productModel } from "@/basic/features/product/models/product.model";
import { ProductWithUI } from "@/basic/features/product/types/product";
import { PRODUCT } from "@/basic/shared/constants/product";

interface ProductCardProps {
  product: ProductWithUI;
  addNotification: AddNotification;
}

export default function ProductCard({
  product,
  addNotification,
}: ProductCardProps) {
  const { products } = useProducts({
    addNotification,
  });
  const { cart, addToCart } = useCart({
    addNotification,
    products,
  });

  const handleClickAddToCart = () => addToCart(product);

  const renderProductDiscount = (discounts: Discount[]) => {
    if (discounts.length === 0) return null;
    return (
      <p className="text-xs text-gray-500">
        {discounts[0].quantity}개 이상 구매시 할인 {discounts[0].rate * 100}%
      </p>
    );
  };

  const { id, name, description, discounts, isRecommended } = product;

  const remainingStock = cartModel.getRemainingStock(product, cart);

  const isLowStock =
    remainingStock <= PRODUCT.LOW_STOCK_THRESHOLD &&
    remainingStock > PRODUCT.OUT_OF_STOCK_THRESHOLD;

  const isOutOfStock = remainingStock <= PRODUCT.OUT_OF_STOCK_THRESHOLD;

  const formattedProductPrice = productModel.getFormattedProductPrice({
    productId: id,
    products: products,
    cart: cart,
    isAdmin: false,
  });

  const maxDiscountPercentage = `~${discountModel.getMaxDiscountPercentage(discounts)}%`;

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
            {maxDiscountPercentage}
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
            {formattedProductPrice}
          </p>
          {renderProductDiscount(discounts)}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {isLowStock && (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {remainingStock}개 남음
            </p>
          )}
          {!isLowStock && (
            <p className="text-xs text-gray-500">재고 {remainingStock}개</p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <button
          onClick={handleClickAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${ADD_TO_CART_BUTTON_VARIANTS[isOutOfStock ? "OUT_OF_STOCK" : "IN_STOCK"]}`}
        >
          {isOutOfStock ? "품절" : "장바구니 담기"}
        </button>
      </div>
    </div>
  );
}

const ADD_TO_CART_BUTTON_VARIANTS = {
  OUT_OF_STOCK: "bg-gray-100 text-gray-400 cursor-not-allowed",
  IN_STOCK: "bg-gray-900 text-white hover:bg-gray-800",
} as const;
