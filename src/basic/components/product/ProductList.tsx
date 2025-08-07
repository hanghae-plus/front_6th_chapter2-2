import { CartItem } from "../../../types";
import { ProductWithUI } from "../../App";
import ProductItem from "./ProductItem";

interface ProductListProps {
  cart: CartItem[];
  products: ProductWithUI[];
  debouncedSearchTerm: string;
  addToCart: (product: ProductWithUI) => void;
  searchProduct: (searchTerm: string) => ProductWithUI[];
  getStockStatus: (
    product: ProductWithUI,
    cart: CartItem[]
  ) => {
    remainingStock: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
  };
}

export default function ProductList({
  cart,
  products,
  debouncedSearchTerm,
  addToCart,
  searchProduct,
  getStockStatus,
}: ProductListProps) {
  const filteredProducts = debouncedSearchTerm
    ? searchProduct(debouncedSearchTerm)
    : products;

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProducts.map((product) => {
        const { remainingStock, isLowStock, isOutOfStock } = getStockStatus(
          product,
          cart
        );
        return (
          <ProductItem
            key={product.id}
            product={product}
            remainingStock={remainingStock}
            isLowStock={isLowStock}
            isOutOfStock={isOutOfStock}
            addToCart={addToCart}
          />
        );
      })}
    </div>
  );
}
