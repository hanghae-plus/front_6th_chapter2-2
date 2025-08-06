import { ProductWithUI } from "../../types";
import { ProductCartItem } from "./ProductCartItem";

interface ProductCartListProps {
  filteredProducts: ProductWithUI[];
  getRemainingStock: (product: ProductWithUI) => number;
  handleAddToCart: (product: ProductWithUI) => void;
  isAdmin: boolean;
}

export const ProductCartList = ({
  filteredProducts,
  getRemainingStock,
  handleAddToCart,
  isAdmin,
}: ProductCartListProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const remainingStock = getRemainingStock(product);

          return (
            <ProductCartItem
              key={product.id}
              product={product}
              remainingStock={remainingStock}
              onAddToCart={handleAddToCart}
              isAdmin={isAdmin}
            />
          );
        })}
      </div>
    </>
  );
};
