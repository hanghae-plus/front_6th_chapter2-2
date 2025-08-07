import { useAtom } from 'jotai';

import { CartHeaderIcon, EmptyCartIcon } from '../icons';
import CartItem from './CartItem';
import { cartAtom } from '../../store/atoms';
import Card from '../ui/Card';

const CartItems = () => {
  const [cart] = useAtom(cartAtom);

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
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CartItems;
