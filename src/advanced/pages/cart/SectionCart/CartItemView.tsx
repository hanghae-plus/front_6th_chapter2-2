import { CartItem } from "../../../../types.ts"
import { IconRemoveFromCart } from "../../../components/icons/IconRemoveFromCart.tsx"
import { calculateItemTotalWithBulkPurchase, removeItemFromCart, updateCartItemQuantity } from "../../../entities/CartItem.ts"
import type { HandleNotificationAdd } from "../../../entities/Notification.ts"
import type { ProductViewModel } from "../../../entities/ProductViewModel.ts"

interface CartItemViewProps {
  item: CartItem
  cart: CartItem[]
  products: ProductViewModel[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  handleNotificationAdd: HandleNotificationAdd
}

export function CartItemView({ item, cart, products, setCart, handleNotificationAdd }: CartItemViewProps) {
  const itemTotal = calculateItemTotalWithBulkPurchase(item, cart)
  const originalPrice = item.product.price * item.quantity

  const hasDiscount = itemTotal < originalPrice
  const discountRate = hasDiscount ? Math.round((1 - itemTotal / originalPrice) * 100) : 0

  function handleProductRemoveFromCart(cartItem: CartItem) {
    setCart(removeItemFromCart(cart, cartItem))
  }

  function handleProductQuantityUpdate(cartItem: CartItem, newQuantity: number) {
    if (newQuantity <= 0) {
      handleProductRemoveFromCart(cartItem)
      return
    }

    const product = products.find((p) => p.id === cartItem.product.id)
    if (!product) return

    const maxStock = product.stock
    if (newQuantity > maxStock) {
      handleNotificationAdd(`재고는 ${maxStock}개까지만 있습니다.`, "error")
      return
    }

    setCart(updateCartItemQuantity(cart, cartItem, newQuantity))
  }

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{item.product.name}</h4>
        <button className="text-gray-400 hover:text-red-500 ml-2" onClick={() => handleProductRemoveFromCart(item)}>
          <IconRemoveFromCart />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            onClick={() => handleProductQuantityUpdate(item, item.quantity - 1)}
          >
            <span className="text-xs">−</span>
          </button>

          <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>

          <button
            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            onClick={() => handleProductQuantityUpdate(item, item.quantity + 1)}
          >
            <span className="text-xs">+</span>
          </button>
        </div>

        <div className="text-right">
          {hasDiscount && <span className="text-xs text-red-500 font-medium block">-{discountRate}%</span>}
          <p className="text-sm font-medium text-gray-900">{Math.round(itemTotal).toLocaleString()}원</p>
        </div>
      </div>
    </div>
  )
}
