import { BagIcon } from '../../../shared/components/icons';
import { useCart } from '../../../shared/hooks/useCart';
import { CartItem } from './CartItem';

export const CartList = () => {
  const { cart } = useCart();

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <BagIcon className="w-5 h-5 mr-2" strokeWidth={1} />
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <BagIcon
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            strokeWidth={1}
          />
          <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map(item => (
            <CartItem key={item.product.id} cartItem={item} />
          ))}
        </div>
      )}
    </section>
  );
};
