import React from 'react';
import { ProductWithUI } from '../../../../types';
import { ProductCard } from './ProductCard';
import { getRemainingStock } from '../../../../utils/calculators';
import { formatPrice } from '../../../../utils/formatters';

interface ProductListProps {
  products: ProductWithUI[];
  filteredProducts: ProductWithUI[];
  cart: Array<{ product: ProductWithUI; quantity: number }>;
  searchTerm: string;
  isAdmin: boolean;
  onAddToCart: (product: ProductWithUI) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  filteredProducts,
  cart,
  searchTerm,
  isAdmin,
  onAddToCart,
}) => {
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
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              getRemainingStock={product => getRemainingStock(product, cart)}
              formatPrice={(price, productId) =>
                formatPrice(
                  price,
                  isAdmin,
                  getRemainingStock(product, cart) <= 0
                )
              }
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </section>
  );
};
