import { CartItem as CartItemType } from '../../../types';
import { CartHeaderIcon, EmptyCartIcon } from '../icons';
import Card from '../ui/Card';
import CartItem from './CartItem';

interface CartItemsProps {
  cart: CartItemType[];
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartItems = ({ cart, handleUpdateQuantity, removeFromCart }: CartItemsProps) => {
  return (
    <Card
      padding='sm'
      headerStyle='margin'
      header={
        <h2 className='text-lg font-semibold mb-4 flex items-center'>
          <CartHeaderIcon />
          장바구니
        </h2>
      }
    >
      {cart.length === 0 ? (
        <div className='text-center py-8'>
          <EmptyCartIcon />
          <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              cart={cart}
              handleUpdateQuantity={handleUpdateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CartItems;
