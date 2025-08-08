import { CartItem } from "../../../../types";
import ListView from "../product/ListView";
import { calculateDiscountRate, calculateTotalPrice } from "./utilities";

interface Props {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

function Cart({ cart, removeFromCart, updateQuantity }: Props) {
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <CartIcon />
        장바구니
      </h2>
      <ListView
        list={cart}
        renderItem={(item) => (
          <Item
            key={item.product.id}
            item={item}
            totalPrice={calculateTotalPrice(item, hasBulkPurchase)}
            discountRate={calculateDiscountRate(
              item.product.price * item.quantity,
              calculateTotalPrice(item, hasBulkPurchase)
            )}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />
        )}
        emptyView={<EmptyCart />}
        className="space-y-3"
      />
    </section>
  );
}

function Item({
  item,
  totalPrice,
  discountRate,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  totalPrice: number;
  discountRate: number;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}) {
  return (
    <div key={item.product.id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {item.product.name}
        </h4>
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-gray-400 hover:text-red-500 ml-2"
        >
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
        <Counter
          quantity={item.quantity}
          onIncrement={(quantity) =>
            onUpdateQuantity(item.product.id, quantity)
          }
          onDecrement={(quantity) =>
            onUpdateQuantity(item.product.id, quantity)
          }
        />
        <div className="text-right">
          {discountRate > 0 && (
            <span className="text-xs text-red-500 font-medium block">
              -{discountRate}%
            </span>
          )}
          <p className="text-sm font-medium text-gray-900">
            {totalPrice.toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
}

function Counter({
  quantity,
  onDecrement,
  onIncrement,
}: {
  quantity: number;
  onDecrement: (quantity: number) => void;
  onIncrement: (quantity: number) => void;
}) {
  return (
    <div className="flex items-center">
      <button
        onClick={() => onDecrement(quantity - 1)}
        disabled={quantity <= 1}
        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
      >
        <span className="text-xs">−</span>
      </button>
      <span className="mx-3 text-sm font-medium w-8 text-center">
        {quantity}
      </span>
      <button
        onClick={() => onIncrement(quantity + 1)}
        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
      >
        <span className="text-xs">+</span>
      </button>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-8">
      <svg
        className="w-16 h-16 text-gray-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      className="w-5 h-5 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
}

export default Cart;
