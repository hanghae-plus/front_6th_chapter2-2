import { useProduct } from "../../../hooks/useProduct";
import { useProductSearch } from "../../../hooks/useProductSearch";
import { useSearch } from "../../../hooks/useSearch";
import { ProductCard } from "./ProductCard";

export const ProductGrid = () => {
  /** 상품 데이터 - useProduct hook 사용 */
  const { products } = useProduct();

  /** 검색어 설정 - Jotai 사용 */
  const { debouncedSearchTerm } = useSearch();

  /** 상품 필터링 */
  const filteredProducts = useProductSearch({
    products,
    searchTerm: debouncedSearchTerm,
  });

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      )}
    </section>
  );
};
