import { useAtomValue } from 'jotai';
import { ProductList } from '../features/product/shop/ui';
import { useCart } from '../features/cart/hooks';
import { useProductSearch } from '../features/product/shop/hooks';
import { ShoppingSidebar } from '../widgets/ShoppingSidebar/ui';
import { productsAtom, searchTermAtom } from '../shared/store';

export default function ShoppingPage() {
  const products = useAtomValue(productsAtom);
  const searchTerm = useAtomValue(searchTermAtom);
  const { filteredProducts } = useProductSearch(products, searchTerm);

  const { addToCart } = useCart();

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        {/* 상품 목록 섹션 */}
        <section>
          <div className='mb-6 flex justify-between items-center'>
            <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
            <div className='text-sm text-gray-600'>
              총 {products.length}개 상품
            </div>
          </div>

          <ProductList
            products={filteredProducts}
            searchTerm={searchTerm}
            onAddToCart={addToCart}
          />
        </section>
      </div>

      {/* ShoppingSidebar (widgets) */}
      <div className='lg:col-span-1'>
        <ShoppingSidebar />
      </div>
    </div>
  );
}
