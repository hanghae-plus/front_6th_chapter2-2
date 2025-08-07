import { useAtomValue } from 'jotai';
import {
  filterProductAtom,
  productAtom,
} from '../../../store/entities/product.store.ts';
import { debouncedSearchTermAtom } from '../../../store/common/search.store.ts';
import ProductGrid from './ProductGrid.tsx';

const ProductArea = () => {
  const products = useAtomValue(productAtom);
  const debouncedSearchTerm = useAtomValue(debouncedSearchTermAtom);
  const filteredProducts = useAtomValue(filterProductAtom);

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <ProductGrid />
      )}
    </section>
  );
};

export default ProductArea;
