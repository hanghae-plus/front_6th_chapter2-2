import { ProductWithUI } from '../../../../entities/product';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: ProductWithUI[];
  searchTerm: string;
  onAddToCart: (product: ProductWithUI) => void;
}

export default function ProductList({
  products,
  searchTerm,
  onAddToCart,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>
          "{searchTerm}"에 대한 검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {products.map((product) => {
        return (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        );
      })}
    </div>
  );
}
