import { AddNotification } from "@/basic/features/notification/types/notification";
import ProductCard from "@/basic/features/product/components/ProductCard";
import { useProducts } from "@/basic/features/product/hooks/useProducts";
import { productModel } from "@/basic/features/product/models/product.model";
import { ProductWithUI } from "@/basic/features/product/types/product";

interface ProductListProps {
  searchTerm: string;
  addNotification: AddNotification;
}

export default function ProductList({
  searchTerm,
  addNotification,
}: ProductListProps) {
  const { products } = useProducts({
    addNotification,
  });

  const filteredProducts = productModel.searchProducts(products, searchTerm);

  const totalProductCount = products.length;

  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">
          총 {totalProductCount}개 상품
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product: ProductWithUI) => (
            <ProductCard
              key={product.id}
              product={product}
              addNotification={addNotification}
            />
          ))}
        </div>
      )}
    </section>
  );
}
