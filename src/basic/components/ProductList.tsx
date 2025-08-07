// src/basic/components/ProductList.tsx
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { ProductCard } from './ProductCard';

export const ProductList = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();

  return (
    <section>
      <div className='mb-6 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
      </div>
      {products.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500'>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
};
