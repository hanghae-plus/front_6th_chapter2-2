// src/basic/components/ProductList.tsx
import { Product } from '../types';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSearch: (keyword: string) => void;
}

export const ProductList = ({ products, onAddToCart, onSearch }: Props) => {
  return (
    <section>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <input
          type="text"
          placeholder="상품 검색..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {product.discounts.length > 0 && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    ~{Math.max(...product.discounts.map(d => d.rate)) * 100}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                )}
                <div className="mb-3">
                  <p className="text-lg font-bold text-gray-900">{product.price.toLocaleString()}원</p>
                  {product.discounts.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="text-xs text-red-600 font-medium">품절임박! {product.stock}개 남음</p>
                  )}
                  {product.stock > 5 && (
                    <p className="text-xs text-gray-500">재고 {product.stock}개</p>
                  )}
                </div>
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock <= 0}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                    product.stock <= 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {product.stock <= 0 ? '품절' : '장바구니 담기'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};