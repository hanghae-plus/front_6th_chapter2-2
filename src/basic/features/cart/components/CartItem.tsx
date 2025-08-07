import { useCart } from "@/basic/features/cart/hooks/useCart";
import { cartModel } from "@/basic/features/cart/models/cart.model";
import { CartItem as CartItemType } from "@/basic/features/cart/types/cart.type";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { AddNotification } from "@/basic/features/notification/types/notification";
import Icon from "@/basic/shared/components/icons/Icon";

interface CartItemProps {
  item: CartItemType;
  addNotification: AddNotification;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export default function CartItem({
  item,
  addNotification,
  selectedCoupon,
  setSelectedCoupon,
}: CartItemProps) {
  const { removeFromCart, updateQuantity, cart } = useCart({
    addNotification,
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
    product: { name, price, id },
    quantity,
  } = item;

  const itemTotal = cartModel.calculateItemTotal(item, cart);

  const originalPrice = item.product.price * item.quantity;

  const hasDiscount = itemTotal < originalPrice;

  const discountRate = hasDiscount
    ? Math.round((1 - itemTotal / originalPrice) * 100)
    : 0;

  return (
    <div key={id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{name}</h4>
        <button
          onClick={() => removeFromCart(id)}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <Icon type="minus" size={4} color="text-gray-400" />
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
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
            {Math.round(itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
}
