import { Product } from '../../../../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  getRemainingStock: (product: Product) => number;
  addToCart: (product: Product) => void;
  debouncedSearchTerm: string;
}

const ProductList = ({
  products,
  getRemainingStock,
  addToCart,
  debouncedSearchTerm,
}: ProductListProps) => {
  // 검색어 반영된 상품 목록
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product: Product) =>
          product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
      )
    : products;

  console.log('filteredProducts', filteredProducts);

  return (
    <section>
      <div className='mb-6 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>전체 상품</h2>
        <div className='text-sm text-gray-600'>총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500'>"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredProducts.map((product: Product) => (
            // 상품 컴포넌트
            <ProductCard
              key={product.id}
              product={product}
              getRemainingStock={getRemainingStock}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
