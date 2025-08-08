import { CartItem, Coupon } from "../../../types.ts"
import { SectionCart } from "./SectionCart/SectionCart.tsx"
import { SectionProductList } from "./SectionProducts/SectionProductList.tsx"

interface PageCartProps {
  searchTerm: string
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  coupons: Coupon[]
  selectedCoupon: Coupon | null
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>
}

function PageCart({ searchTerm, cart, setCart, coupons, selectedCoupon, setSelectedCoupon }: PageCartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <SectionProductList searchTerm={searchTerm} cart={cart} setCart={setCart} />
      </div>

      <SectionCart coupons={coupons} selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} cart={cart} setCart={setCart} />
    </div>
  )
}

export default PageCart
