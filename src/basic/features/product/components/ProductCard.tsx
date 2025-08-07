import { useCallback } from "react";

import { useCart } from "@/basic/features/cart/hooks/useCart";
import { cartModel } from "@/basic/features/cart/models/cart.model";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { discountModel } from "@/basic/features/discount/models/discount.model";
import { Discount } from "@/basic/features/discount/types/discount.type";
import { AddNotification } from "@/basic/features/notification/types/notification";
import { useProducts } from "@/basic/features/product/hooks/useProducts";
import { productModel } from "@/basic/features/product/models/product.model";
import { ProductWithUI } from "@/basic/features/product/types/product";
import Icon from "@/basic/shared/components/icons/Icon";
import { PRODUCT } from "@/basic/shared/constants/product";

interface ProductCardProps {
  product: ProductWithUI;
  addNotification: AddNotification;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function ProductCard({
  product,
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: ProductCardProps) {
  const { products } = useProducts();
  const { cart, addToCart } = useCart({
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  });

  const handleClickAddToCart = useCallback(() => {
    addToCart(product);
  }, []);

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
          <Icon type="image" size={24} color="text-gray-300" />
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
