import { useSearchTerm } from "../../hooks/useSearchTerm";
import { IProductWithUI } from "../../type";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: IProductWithUI[];
}

const ProductList = ({ products }: ProductListProps) => {
  const { debouncedSearchTerm } = useSearchTerm();

  // 검색어 반영된 상품 목록
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            // 상품 컴포넌트
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
