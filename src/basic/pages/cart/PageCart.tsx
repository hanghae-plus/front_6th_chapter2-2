import { CartItem, Coupon } from "../../../types.ts"
import type { HandleNotificationAdd } from "../../entities/Notification.ts"
import { ProductViewModel } from "../../entities/ProductViewModel.ts"
import { SectionCart } from "./ui/SectionCart.tsx"
import { SectionProductList } from "./ui/SectionProductList.tsx"

interface PageCartProps {
  products: ProductViewModel[]
  searchTerm: string
  cart: CartItem[]
  setCart: (cart: CartItem[]) => void
  coupons: Coupon[]
  selectedCoupon: Coupon | null
  setSelectedCoupon: (coupon: Coupon | null) => void
  handleNotificationAdd: HandleNotificationAdd
}

function PageCart({
  products,
  searchTerm,
  cart,
  setCart,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  handleNotificationAdd,
}: PageCartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <SectionProductList
          products={products}
          searchTerm={searchTerm}
          cart={cart}
          setCart={setCart}
          handleNotificationAdd={handleNotificationAdd}
        />
      </div>

      <SectionCart
        products={products}
        coupons={coupons}
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
        cart={cart}
        setCart={setCart}
        handleNotificationAdd={handleNotificationAdd}
      />
    </div>
  )
}

export default PageCart
