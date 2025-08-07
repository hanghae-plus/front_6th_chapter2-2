import { useAtomValue } from 'jotai';

import { productsAtom } from '../../../entities/product';
import { useCartService } from '../../../features/cart-management';
import { useDebouncedSearch } from '../../../features/search';
import { CartHeader } from '../../../widgets/cart-header';
import { CartSidebar } from '../../../widgets/cart-sidebar';
import { ProductList } from '../../../widgets/shopping-product-list';

interface CartPageProps {
  onChangeAdminPage: () => void;
}

export function CartPage({ onChangeAdminPage }: CartPageProps) {
  const products = useAtomValue(productsAtom);

  const { cart, handleAddToCart } = useCartService({ products });
  const [searchTerm, debouncedSearchTerm, onChangeSearchTerm] = useDebouncedSearch();

  return (
    <>
      <CartHeader
        searchTerm={searchTerm}
        cart={cart}
        onChangeSearchTerm={onChangeSearchTerm}
        onChangeAdminPage={onChangeAdminPage}
      />

      <main className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3'>
            {/* 상품 목록 */}
            <section>
              <div className='mb-6 flex justify-between items-center'>
                <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
                <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
              </div>
              <ProductList
                products={products}
                debouncedSearchTerm={debouncedSearchTerm}
                cart={cart}
                addToCart={handleAddToCart}
              />
            </section>
          </div>

          <CartSidebar products={products} />
        </div>
      </main>
    </>
  );
}
