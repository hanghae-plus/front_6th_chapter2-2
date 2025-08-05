import { useAtom } from "jotai";
import { filteredProductsAtom } from "../../store";
import { ProductCartList } from "./ProductCartList";
import { productsAtom } from "../../store/product";

// 컴포넌트 정의
const ProductListSection = () => {
  const [products] = useAtom(productsAtom);
  const [filteredProducts] = useAtom(filteredProductsAtom);
  console.log(products, filteredProducts);
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
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <ProductCartList />
        )}
      </section>
    </div>
  );
};

export default ProductListSection;
