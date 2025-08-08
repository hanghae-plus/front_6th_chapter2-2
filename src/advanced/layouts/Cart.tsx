import { useAtom } from 'jotai';

import { CartItem as TCartItem } from '../../types';
import CartItem from '../components/CartItem';
import { productsAtom } from '../store/atoms';

type CartProps = {
  cart: TCartItem[];
  updateQuantity: (productId: string, newQuantity: number) => void | unknown;
  removeFromCart: (productId: string) => void;
  calculateItemTotal: (item: TCartItem) => number;
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
};

export default function Cart(props: CartProps) {
  const { cart, updateQuantity, removeFromCart, calculateItemTotal, addNotification } = props;
  const [products] = useAtom(productsAtom);

  const handleClickQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;

    if (newQuantity > maxStock) {
      addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }

    // Support both signatures:
    // 1) (productId: string, newQuantity: number) => void
    // 2) ({ productId, quantity }: { productId: string; quantity: number }) => void (Jotai setter)
    if (typeof updateQuantity === 'function') {
      const fn = updateQuantity as unknown as
        | ((productId: string, newQuantity: number) => void)
        | ((arg: { productId: string; quantity: number }) => void);

      // 함수 선언의 인자 길이를 기준으로 분기 (2개 이상이면 (id, qty) 서명으로 간주)
      if ((fn as Function).length >= 2) {
        (fn as (productId: string, newQuantity: number) => void)(productId, newQuantity);
      } else {
        (fn as (arg: { productId: string; quantity: number }) => void)({
          productId,
          quantity: newQuantity,
        });
      }
    }
  };

  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <h2 className='text-lg font-semibold mb-4 flex items-center'>
        <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
          />
        </svg>
        장바구니
      </h2>
      {cart.length === 0 ? (
        <div className='text-center py-8'>
          <svg
            className='w-16 h-16 text-gray-300 mx-auto mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1}
              d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
            />
          </svg>
          <p className='text-gray-500 text-sm'>장바구니가 비어있습니다</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {cart.map((item) => {
            const itemTotal = calculateItemTotal(item);
            const originalPrice = item.product.price * item.quantity;
            const hasDiscount = itemTotal < originalPrice;
            const discountRate = hasDiscount
              ? Math.round((1 - itemTotal / originalPrice) * 100)
              : 0;

            return (
              <CartItem
                key={item.product.id}
                item={item}
                hasDiscount={hasDiscount}
                discountRate={discountRate}
                itemTotal={itemTotal}
                handleClickQuantity={handleClickQuantity}
                removeFromCart={removeFromCart}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
