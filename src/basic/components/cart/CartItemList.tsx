import { CartItem } from '../../../types';
import { ProductWithUI } from '../../App';
import { calculateItemTotal } from '../../utils/calculateItem';
type NotificationType = 'error' | 'success' | 'warning';

interface CartItemListProps {
  cart: CartItem[];
  addNotification: (message: string, type?: NotificationType) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  products: ProductWithUI[];
}

export default function CartItemList({ cart, removeFromCart, updateQuantity }: CartItemListProps) {
  return (
    <div className='space-y-3'>
      {cart.map((item) => {
        const itemTotal = calculateItemTotal(item, cart);
        const originalPrice = item.product.price * item.quantity;
        const hasDiscount = itemTotal < originalPrice;
        const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0;

        return (
          <div key={item.product.id} className='border-b pb-3 last:border-b-0'>
            <div className='flex justify-between items-start mb-2'>
              <h4 className='text-sm font-medium text-gray-900 flex-1'>{item.product.name}</h4>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className='text-gray-400 hover:text-red-500 ml-2'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                >
                  <span className='text-xs'>−</span>
                </button>
                <span className='mx-3 text-sm font-medium w-8 text-center'>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className='w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100'
                >
                  <span className='text-xs'>+</span>
                </button>
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
      })}
    </div>
  );
}
