import { ProductWithUI } from "../../hooks/useProducts";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: ProductWithUI[];
  searchInfo: {
    isSearching: boolean;
    searchTerm: string;
  };
  formatPriceWithAdmin: (price: number, productId?: string) => string;
  getRemainingStock: (product: ProductWithUI) => number;
  addToCart: (product: ProductWithUI) => void;
}

export const ProductList = ({
  products,
  searchInfo,
  formatPriceWithAdmin,
  getRemainingStock,
  addToCart,
}: ProductListProps) => {
  return (
    <>
      <ProductListHeader productCount={products.length} />
      <ProductListContent
        products={products}
        searchInfo={searchInfo}
        formatPriceWithAdmin={formatPriceWithAdmin}
        getRemainingStock={getRemainingStock}
        addToCart={addToCart}
      />
    </>
  );
};

// 상품 리스트 헤더
const ProductListHeader = ({ productCount }: { productCount: number }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
      <div className="text-sm text-gray-600">총 {productCount}개 상품</div>
    </div>
  );
};

// 상품 리스트 콘텐츠
const ProductListContent = ({
  products,
  searchInfo,
  formatPriceWithAdmin,
  getRemainingStock,
  addToCart,
}: ProductListProps) => {
  if (products.length === 0) {
    return <EmptyProductList searchInfo={searchInfo} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          formatPriceWithAdmin={formatPriceWithAdmin}
          getRemainingStock={getRemainingStock}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
};

// 빈 상품 리스트
const EmptyProductList = ({ searchInfo }: { searchInfo: { isSearching: boolean; searchTerm: string } }) => (
  <div className="text-center py-12">
    <p className="text-gray-500">
      {searchInfo.isSearching ? `"${searchInfo.searchTerm}"에 대한 검색 결과가 없습니다.` : "상품이 없습니다."}
    </p>
  </div>
);
