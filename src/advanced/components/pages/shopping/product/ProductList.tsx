import React, { useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { ProductCard } from './ProductCard';
import { getRemainingStock } from '../../../../utils/calculators';
import { formatPrice } from '../../../../utils/formatters';
import {
  productsAtom,
  filteredProductsAtom,
} from '../../../../atoms/productAtoms';
import { cartAtom, addToCartAtom } from '../../../../atoms/cartAtoms';
import { searchTermAtom } from '../../../../atoms/uiAtoms';

export const ProductList = React.memo(() => {
  // 읽기 전용 상태
  const products = useAtomValue(productsAtom);
  const filteredProducts = useAtomValue(filteredProductsAtom);
  const cart = useAtomValue(cartAtom);
  const searchTerm = useAtomValue(searchTermAtom);

  // 쓰기 전용 액션
  const addToCart = useSetAtom(addToCartAtom);

  // 복잡한 계산 결과 메모이제이션
  const productCards = useMemo(() => {
    return filteredProducts.map(product => {
      const remainingStock = getRemainingStock(product, cart);

      return (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
          getRemainingStock={() => remainingStock}
          formatPrice={price => formatPrice(price, remainingStock <= 0)}
        />
      );
    });
  }, [filteredProducts, cart, addToCart]);

  return (
    <section>
      <div className='mb-6 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
        <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500'>
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {productCards}
        </div>
      )}
    </section>
  );
});
