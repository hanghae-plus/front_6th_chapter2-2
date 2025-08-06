import { ProductWithUI } from "../../types";
import { ProductCartItem } from "./ProductCartItem";

interface ProductCartListProps {
  filteredProducts: ProductWithUI[];
}

export const ProductCartList = ({ filteredProducts }: ProductCartListProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCartItem key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};
