import { CartItem, Product, ProductWithUI } from '../../../../models/entities';
import ProductGrid from '../../product/ProductGrid.tsx';

const CheckOutArea = ({
  debouncedSearchTerm,
  cart,
  addToCart,
  products,
}: {
  products: ProductWithUI[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  debouncedSearchTerm: string;
}) => {
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        product =>
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

        {/*<Title>전체 상품</Title>*/}
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <ProductGrid
          filteredProducts={filteredProducts}
          cart={cart}
          addToCart={addToCart}
        />
      )}
    </section>
  );
};

export default CheckOutArea;
