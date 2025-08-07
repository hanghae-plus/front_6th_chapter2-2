import { CartItem as CartItemType } from '../../../types';
import { calculateItemTotal, calculateOriginalPrice } from '../../models/cart';
import { hasDiscount, calculateDiscountRate } from '../../models/discount';
import { CloseIcon } from '../icons';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface CartItemProps {
  item: CartItemType;
  cart: CartItemType[];
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartItem = ({ item, cart, handleUpdateQuantity, removeFromCart }: CartItemProps) => {
  const itemTotal = calculateItemTotal(item, cart);
  const originalPrice = calculateOriginalPrice(item);
  const hasDiscountValue = hasDiscount(itemTotal, originalPrice);
  const discountRate = calculateDiscountRate(itemTotal, originalPrice);

  return (
    <div className='border-b pb-3 last:border-b-0'>
      <div className='flex justify-between items-start mb-2'>
        <h4 className='text-sm font-medium text-gray-900 flex-1'>{item.product.name}</h4>
        <Button
          onClick={() => removeFromCart(item.product.id)}
          className='text-gray-400 hover:text-red-500 ml-2'
        >
          <CloseIcon />
        </Button>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Button
            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
            hasRounded
            className='w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100'
          >
            <span className='text-xs'>−</span>
          </Button>
          <span className='mx-3 text-sm font-medium w-8 text-center'>{item.quantity}</span>
          <Button
            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
            hasRounded
            className='w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100'
          >
            <span className='text-xs'>+</span>
          </Button>
        </div>
        <div className='text-right'>
          {hasDiscountValue && (
            <Badge size='xs' rounded='none' className='text-red-500 font-medium block'>
              -{discountRate}%
            </Badge>
          )}
          <p className='text-sm font-medium text-gray-900'>
            {Math.round(itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
