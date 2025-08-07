import { CartItem } from "../../../../types";
import { ProductWithUI } from "../../../App";
import { getRemainingStock } from "../../../models/cart";
import { formatPrice } from "../../../utils/formatters";
import { Product } from "./Product";
import { ProductListSummary } from "../ProductListSummary";
import { Search } from "../Search";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { searchTermAtom } from "../../../atoms";
import { useAtom } from "jotai";

export function ProductList({
  products,
  cart,
  addToCart,
}: {
  products: ProductWithUI[];
  cart: CartItem[];
  addToCart: ({
    product,
    cart,
  }: {
    product: ProductWithUI;
    cart: CartItem[];
  }) => void;
}) {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
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

  return (
    <section>
      <ProductListSummary products={products} />
      {filteredProducts.length === 0 ? (
        <Search.NoResults debouncedSearchTerm={debouncedSearchTerm} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const remainingStock = getRemainingStock({
              product,
              cart,
            });

            return (
              <Product
                key={product.id}
                product={product}
                cart={cart}
                addToCart={addToCart}
                remainingStock={remainingStock}
                formattedPrice={formatPrice({
                  price: product.price,
                  productId: product.id,
                  products,
                  isAdmin: false,
                  cart,
                })}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
