// src/basic/components/ProductList.tsx
import { Product } from '../types';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductList = ({ products, onAddToCart }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white shadow rounded-lg p-4 flex flex-col">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p className="text-gray-600">{product.price.toLocaleString()}원</p>
          <p className="text-sm text-gray-500 mt-2">재고: {product.stock}개</p>
          <button
            onClick={() => onAddToCart(product)}
            className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            장바구니 담기
          </button>
        </div>
      ))}
    </div>
  );
};
