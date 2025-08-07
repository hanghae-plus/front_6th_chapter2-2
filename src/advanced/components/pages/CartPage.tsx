import { ProductWithUI } from '../../../types';
import Cart from '../cart/Cart';
import ProductList from '../product/ProductList';

interface CartPageProps {
  isAdmin: boolean;
}

const CartPage = ({ isAdmin }: CartPageProps) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductList isAdmin={isAdmin} />
      </div>
      <div className='lg:col-span-1'>
        <Cart />
      </div>
    </div>
  );
};

export default CartPage;
