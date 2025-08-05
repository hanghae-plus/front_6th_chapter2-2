import { Product } from "../../../types";
import { ProductCartList } from "./ProductCartList";

// 필요한 props 타입 정의 (TypeScript의 경우)
interface ProductListSectionProps {
  products: Product[];
  filteredProducts: Product[];
  debouncedSearchTerm: string;
  getRemainingStock: (product: Product) => number;
  handleAddToCart: (product: Product) => void;
  isAdmin: boolean;
}

// 컴포넌트 정의
const ProductListSection = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  getRemainingStock,
  handleAddToCart,
  isAdmin,
}: ProductListSectionProps) => {
  return (
    <div className="lg:col-span-3">
      <section>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
          <div className="text-sm text-gray-600">
            총 {products.length}개 상품
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <ProductCartList
            filteredProducts={filteredProducts}
            getRemainingStock={getRemainingStock}
            handleAddToCart={handleAddToCart}
            isAdmin={isAdmin}
          />
        )}
      </section>
    </div>
  );
};

export default ProductListSection;
