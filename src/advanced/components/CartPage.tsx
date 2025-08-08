import { OrderSummary } from './cart-page/OrderSummary';
import { ProductList } from './cart-page/ProductList';

export function CartPage() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <ProductList />
      <OrderSummary />
    </div>
  );
}
