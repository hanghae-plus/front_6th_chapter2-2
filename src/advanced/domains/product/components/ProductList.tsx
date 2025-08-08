import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { searchTermAtom } from "../../../shared";
import { useCartAtom } from "../../cart";
import { useProductAtom } from "../hooks";
import type { Product } from "../types";
import { filterProducts } from "../utils";
import { ProductCard } from "./ProductCard";

export function ProductList() {
  const { products, formatPrice, getRemainingStock } = useProductAtom();
  const { addToCart } = useCartAtom();
  const searchTerm = useAtomValue(searchTermAtom);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = filterProducts(products, debouncedSearchTerm);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              remainingStock={getRemainingStock(product)}
              formatPrice={formatPrice}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
