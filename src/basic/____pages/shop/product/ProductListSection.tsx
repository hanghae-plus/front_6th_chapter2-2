import { Product } from "../../../../types";
import { useProducts } from "../../../___features/product/use-products";
import ListView from "./ListView";
import ProductCard from "./ProductCard";

interface Props {
  searchTerm: string;
  getRemainingStock: (product: Product) => number;
  addToCart: (product: Product) => void;
}

function ProductListSection({
  searchTerm,
  getRemainingStock,
  addToCart,
}: Props) {
  const { products } = useProducts({
    searchTerm,
  });

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>

      <ListView
        list={products}
        renderItem={(product) => (
          <ProductCard
            key={product.id}
            product={{ ...product, stock: getRemainingStock(product) }}
            onClickAddToCart={addToCart}
          />
        )}
        emptyView={
          <div className="text-center py-12">
            <p className="text-gray-500">
              "{searchTerm}"에 대한 검색 결과가 없습니다.
            </p>
          </div>
        }
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      />
    </section>
  );
}

export default ProductListSection;
