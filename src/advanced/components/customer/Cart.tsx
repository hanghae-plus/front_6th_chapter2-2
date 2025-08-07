import { CartItem as CartItemType } from '../../../types';
import BasketIcon from '../icons/BasketIcon';
import BasketSmallIcon from '../icons/BasketSmallIcon';
import CartItem from './CartItem';

interface CartProps {
  cart: CartItemType[];
  calculateItemTotal: (item: CartItemType) => number;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const Cart = ({ cart, calculateItemTotal, onRemove, onUpdateQuantity }: CartProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <BasketSmallIcon />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <BasketIcon />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map(item => {
            const itemTotal = calculateItemTotal(item);

            return (
              <CartItem
                key={item.product.id}
                item={item}
                itemTotal={itemTotal}
                onRemove={onRemove}
                onUpdateQuantity={onUpdateQuantity}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Cart;
