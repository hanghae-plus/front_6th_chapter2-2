import { IProductWithUI } from "../type";
import { formatPrice } from "../utils/formatters";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: IProductWithUI[];
  addItemToCart: (product: IProductWithUI) => void;
  getRemainingStock: (product: IProductWithUI) => number;
  debouncedSearchTerm?: string;
}

const ProductList = ({
  products,
  addItemToCart,
  getRemainingStock,
  debouncedSearchTerm,
}: ProductListProps) => {
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

  // 가격 텍스트 처리
  const getPriceText = (item: IProductWithUI) => {
    if (item && getRemainingStock(item) <= 0) return "SOLD OUT";
    return formatPrice(item.price, "krw");
  };

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
          {filteredProducts.map((product) => {
            const remainingStock = getRemainingStock(product);

            return (
              // 상품 컴포넌트
              <ProductItem
                key={product.id}
                product={product}
                remainingStock={remainingStock}
                priceText={getPriceText(product)}
                addItemToCart={addItemToCart}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductList;
