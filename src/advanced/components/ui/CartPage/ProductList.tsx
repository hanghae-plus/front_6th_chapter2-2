import { Product } from "./Product";
import { ProductListSummary } from "../ProductListSummary";
import { Search } from "../Search";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { searchTermAtom } from "../../../atoms";
import { useAtom } from "jotai";
import { useProducts } from "../../../hooks/useProducts";

export function ProductList() {
  const { products } = useProducts();
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
      <ProductListSummary />
      {filteredProducts.length === 0 ? (
        <Search.NoResults />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            return <Product key={product.id} product={product} />;
          })}
        </div>
      )}
    </section>
  );
}
