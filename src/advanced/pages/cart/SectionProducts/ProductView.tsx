import { addItemToCart, canAddToCart } from "../../../entities/CartItem.ts"
import { getRemainingStock } from "../../../entities/Product.ts"
import type { ProductViewModel } from "../../../entities/ProductViewModel.ts"

import { IconProductPlaceholder } from "../../../components/icons/IconProductPlaceholder.tsx"
import { useCart } from "../../../hooks/useCart.ts"
import { useNotification } from "../../../hooks/useNotification.ts"

export function ProductView({ product }: { product: ProductViewModel }) {
  const { cart, setCart } = useCart()
  const { handleNotificationAdd } = useNotification()

  const remainingStock = getRemainingStock(product, cart)

  const formattedPrice = remainingStock <= 0 ? "SOLD OUT" : `₩${product.price.toLocaleString()}`

  const maxDiscountRatePercent = product.discounts.length > 0 ? Math.max(...product.discounts.map((d) => d.rate)) * 100 : 0

  const discountString =
    product.discounts.length > 0 ? `${product.discounts[0].quantity}개 이상 구매시 할인 ${product.discounts[0].rate * 100}%` : ""

  function handleProductAddToCart(product: ProductViewModel) {
    if (!canAddToCart(cart, product)) {
      const remainingStock = getRemainingStock(product, cart)

      if (remainingStock <= 0) {
        handleNotificationAdd("재고가 부족합니다!", "error")
      } else {
        handleNotificationAdd(`재고는 ${product.stock}개까지만 있습니다.`, "error")
      }
      return
    }

    setCart(addItemToCart(cart, product))
    handleNotificationAdd("장바구니에 담았습니다", "success")
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 상품 이미지 영역 (placeholder) */}
      <div className="relative">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <IconProductPlaceholder />
        </div>

        {product.isRecommended && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">BEST</span>}

        {product.discounts.length > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">~{maxDiscountRatePercent}%</span>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {product.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>}

        {/* 가격 정보 */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">{formattedPrice}</p>
          {product.discounts.length > 0 && <p className="text-xs text-gray-500">{discountString}</p>}
        </div>

        {/* 재고 상태 */}
        <div className="mb-3">
          {remainingStock <= 5 && remainingStock > 0 && (
            <p className="text-xs text-red-600 font-medium">품절임박! {remainingStock}개 남음</p>
          )}
          {remainingStock > 5 && <p className="text-xs text-gray-500">재고 {remainingStock}개</p>}
        </div>

        {/* 장바구니 버튼 */}
        <button
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            remainingStock <= 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
          disabled={remainingStock <= 0}
          onClick={() => handleProductAddToCart(product)}
        >
          {remainingStock <= 0 ? "품절" : "장바구니 담기"}
        </button>
      </div>
    </div>
  )
}
