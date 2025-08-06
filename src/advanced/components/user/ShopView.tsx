import { useAtomValue } from 'jotai';
import { getRemainingStock } from '../../utils/calculations/stockCalculations';
import { filteredProducts } from '../../utils/calculations/productCalculations';
import ProductCard from '../ui/ProductCard';
import Cart from './Cart';
import { productsAtom } from '../../atoms/productsAtom';
import { cartAtom } from '../../atoms/cartAtoms';
import { useCart } from '../../hooks/cart/useCart';
import { useSearch } from '../../hooks/search/useSearch';
import useCheckout from '../../hooks/checkout/useCheckout';

export default function ShopView() {
  // atom에서 직접 가져오기
  const products = useAtomValue(productsAtom);
  const cart = useAtomValue(cartAtom);

  // 검색 훅 사용
  const { debouncedQuery } = useSearch();

  // 커스텀 훅에서 함수들 가져오기
  const { addToCart } = useCart();
  useCheckout();

  // 계산된 값들
  const filteredProductList = filteredProducts(products, debouncedQuery);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='lg:col-span-3'>
        <section>
          <div className='mb-6 flex justify-between items-center'>
            <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
            <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
          </div>
          {filteredProductList.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500'>"{debouncedQuery}"에 대한 검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredProductList?.map((product) => {
                const remainingStock = getRemainingStock(product, cart);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cart={cart}
                    remainingStock={remainingStock}
                    addToCart={addToCart}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
      <Cart />
    </div>
  );
}
