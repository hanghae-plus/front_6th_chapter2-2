import { useAtom } from "jotai";
import { filteredProductsAtom, getRemainingStockAtom } from "../../store";
import { ProductCartItem } from "./ProductCartItem";

export const ProductCartList = () => {
  const [filteredProducts] = useAtom(filteredProductsAtom);
  const [getRemainingStock] = useAtom(getRemainingStockAtom);

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
