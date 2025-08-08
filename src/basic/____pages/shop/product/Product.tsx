import { ProductWithUI } from "../../../___features/product/types";

const ProductStatus = {
  SoldOut: "SOLD OUT",
  InStock: "IN STOCK",
  LowStock: "LOW STOCK",
} as const;

type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

interface Props {
  product: ProductWithUI;
  onClickCartButton: (productId: string, quantity: number) => void;
}

function Product({ product, onClickCartButton }: Props) {
  const status = ((stock) => {
    if (stock <= 0) {
      return ProductStatus.SoldOut;
    }

    if (stock <= 5) {
      return ProductStatus.LowStock;
    }

    return ProductStatus.InStock;
  })(product.stock);

  return (
    <div
      key={product.id}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        {/* 상품 이미지 */}
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <svg
            className="w-24 h-24 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        {/* 추천 뱃지 */}
        {product.isRecommended && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            BEST
          </span>
        )}
        {/* 할인 뱃지 */}
        {product.discounts.length > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
          </span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            {status === ProductStatus.SoldOut
              ? "SOLD OUT"
              : `₩${product.price.toLocaleString()}`}
          </p>
          {product.discounts.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.discounts[0].quantity}개 이상 구매시 할인{" "}
              {product.discounts[0].rate * 100}%
            </p>
          )}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {status === ProductStatus.LowStock && (
            <p className="text-xs text-red-600 font-medium">
              품절임박! {product.stock}개 남음
            </p>
          )}
          {status === ProductStatus.InStock && (
            <p className="text-xs text-gray-500">재고 {product.stock}개</p>
          )}
        </div>

        <AddToCartButton
          outOfStock={status === ProductStatus.SoldOut}
          onClick={() => onClickCartButton(product.id, 1)}
        />
      </div>
    </div>
  );
}

interface AddToCartButtonProps {
  outOfStock: boolean;
  onClick: () => void;
}

function AddToCartButton({ outOfStock, onClick }: AddToCartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={outOfStock}
      className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
        outOfStock
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-900 text-white hover:bg-gray-800"
      }`}
    >
      {outOfStock ? "품절" : "장바구니 담기"}
    </button>
  );
}

export default Product;
