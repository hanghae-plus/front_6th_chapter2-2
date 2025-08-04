import { FC } from "react";
import { formatPrice } from "../utils/formatters";
import { ProductWithUI } from "../constants";
import { Product } from "../../types";

// props 타입 정의
interface ProductListProps {
  products: ProductWithUI[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: FC<ProductListProps> = ({
  products,
  onAddToCart,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product) => (
      <div
        key={product.id}
        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{product.description}</p>
          <div className="flex items-center mt-3">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">재고: {product.stock}개</p>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className={`mt-4 w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
              product.stock > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {product.stock > 0 ? "장바구니에 담기" : "재고 없음"}
          </button>
        </div>
      </div>
    ))}
  </div>
);
