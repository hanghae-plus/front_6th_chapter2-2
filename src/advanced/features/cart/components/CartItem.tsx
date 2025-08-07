import { useCart } from "@/advanced/features/cart/hooks/useCart";
import { cartModel } from "@/advanced/features/cart/models/cart.model";
import { CartItem as CartItemType } from "@/advanced/features/cart/types/cart.type";
import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import Icon from "@/advanced/shared/components/icons/Icon";
import { roundAmount } from "@/advanced/shared/utils/calculation.util";
import { formatPrice } from "@/advanced/shared/utils/format.util";

interface CartItemProps {
  item: CartItemType;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function CartItem({
  item,
  selectedCoupon,
  setSelectedCoupon,
}: CartItemProps) {
  const { removeFromCart, updateQuantity, cart } = useCart({
    selectedCoupon,
    setSelectedCoupon,
  });

  const handleClickDecrease = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleClickIncrease = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const {
    product: { name, id },
    quantity,
  } = item;

  const itemTotal = roundAmount(cartModel.calculateItemTotal(item, cart));

  const originalPrice = item.product.price * item.quantity;

  const hasDiscount = itemTotal < originalPrice;

  const discountRate = hasDiscount
    ? roundAmount((1 - itemTotal / originalPrice) * 100)
    : 0;

  return (
    <div key={id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{name}</h4>
        <button
          onClick={() => removeFromCart(id)}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <Icon type="close" size={4} color="text-gray-400" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => handleClickDecrease(id, quantity - 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleClickIncrease(id, quantity + 1)}
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">+</span>
          </button>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <span className="text-xs text-red-500 font-medium block">
              -{discountRate}%
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {formatPrice.unit(itemTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}
