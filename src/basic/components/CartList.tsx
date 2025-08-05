import { ICartItem } from "../type";
import { LargeBagIcon, SmallBagIcon } from "./icon";
import CartItem from "./CartItem";

interface CartListProps {
  cart: ICartItem[];
  calculateItemTotal: (item: ICartItem) => number;
  removeItemFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, newQuantity: number) => void;
}

const CartList = ({
  cart,
  calculateItemTotal,
  removeItemFromCart,
  updateItemQuantity,
}: CartListProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        {/* 장바구니 아이콘 */}
        <SmallBagIcon />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          {/* 장바구니 큰 아이콘 */}
          <LargeBagIcon />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => {
            return (
              // 카트 상품 컴포넌트
              <CartItem
                item={item}
                calculateItemTotal={calculateItemTotal}
                removeItemFromCart={removeItemFromCart}
                updateItemQuantity={updateItemQuantity}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CartList;
