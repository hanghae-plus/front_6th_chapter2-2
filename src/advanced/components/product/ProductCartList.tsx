import { ProductCartItem } from "./ProductCartItem";

import { useProduct } from "./hooks/useProduct";

export const ProductCartList = () => {
  const { filteredProducts, getRemainingStock } = useProduct();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const remainingStock = getRemainingStock(product.id);

          return (
            <ProductCartItem
              key={product.id}
              product={product}
              remainingStock={remainingStock}
            />
          );
        })}
      </div>
    </>
  );
};
