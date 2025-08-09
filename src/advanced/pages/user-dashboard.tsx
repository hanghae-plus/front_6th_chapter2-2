import { ProductWithUI } from '@/shared/constants';
import { Cart, Coupons, Payments, ProductList } from '../ui/index';
import { useProducts, useCart } from '../contexts';

interface UserDashboardProps {
  filteredProducts: ProductWithUI[];
  debouncedSearchTerm: string;
  isAdmin: boolean;
}

export function UserDashboard({
  filteredProducts,
  debouncedSearchTerm,
  isAdmin,
}: UserDashboardProps) {
  const { products } = useProducts();
  const { cart, addToCart, getStock } = useCart();
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <ProductList
          filteredProducts={filteredProducts}
          totalProductCount={products.length}
          debouncedSearchTerm={debouncedSearchTerm}
          getRemainingStock={getStock}
          isAdmin={isAdmin}
          addToCart={addToCart}
        />
      </div>

      <div className='lg:col-span-1'>
        <div className='sticky top-24 space-y-4'>
          <Cart />

          {cart.length > 0 && (
            <>
              <Coupons />
              <Payments />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
