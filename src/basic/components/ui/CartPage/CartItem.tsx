import { CartItem as CartItemType } from "../../../../types";
import { ProductWithUI } from "../../../App";
import { CloseIcon } from "../../icons";

export function CartItem({
  item,
  itemTotal,
  hasDiscount,
  discountRate,
  removeFromCart,
  updateQuantity,
  cart,
  products,
}: {
  item: CartItemType;
  itemTotal: number;
  hasDiscount: boolean;
  discountRate: number;
  removeFromCart: ({
    productId,
    cart,
  }: {
    productId: string;
    cart: CartItemType[];
  }) => void;
  updateQuantity: ({
    productId,
    newQuantity,
    cart,
    products,
  }: {
    productId: string;
    newQuantity: number;
    cart: CartItemType[];
    products: ProductWithUI[];
  }) => void;
  cart: CartItemType[];
  products: ProductWithUI[];
}) {
  return (
    <div key={item.product.id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <button
          onClick={() => removeFromCart({ productId: item.product.id, cart })}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() =>
              updateQuantity({
                productId: item.product.id,
                newQuantity: item.quantity - 1,
                cart,
                products,
              })
            }
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
          >
            <span className="text-xs">−</span>
          </button>
          <span className="mx-3 text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              updateQuantity({
                productId: item.product.id,
                newQuantity: item.quantity + 1,
                cart,
                products,
              })
            }
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
