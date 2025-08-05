import type { CartItem } from '../../../types';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import { DeleteIcon } from '../ui/Icons';

interface CartItemProps {
  item: CartItem;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  hasDiscount: boolean;
  discountRate: number;
  itemTotal: number;
}

export default function CartItem({
  item,
  onRemoveFromCart,
  onUpdateQuantity,
  hasDiscount,
  discountRate,
  itemTotal,
}: CartItemProps) {
  return (
    <div className='border-b pb-3 last:border-b-0'>
      <div className='flex justify-between items-start mb-2'>
        <h4 className='text-sm font-medium text-gray-900 flex-1'>{item.product.name}</h4>

        <IconButton
          variant='danger'
          onClick={() => onRemoveFromCart(item.product.id)}
          icon={<DeleteIcon />}
        />
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            size='xs'
            variant='outline'
          >
            <span className='text-xs'>−</span>
          </Button>
          <span className='mx-3 text-sm font-medium w-8 text-center'>{item.quantity}</span>

          <Button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            size='xs'
            variant='outline'
          >
            <span className='text-xs'>+</span>
          </Button>
        </div>
        <div className='text-right'>
          {hasDiscount && (
            <span className='text-xs text-red-500 font-medium block'>-{discountRate}%</span>
          )}
          <p className='text-sm font-medium text-gray-900'>
            {Math.round(itemTotal).toLocaleString()}원
          </p>
        </div>
      </div>
    </div>
  );
}
