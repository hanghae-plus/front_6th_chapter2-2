import { useState } from "react"
import Header from "./components/Header.tsx"
import Notifications from "./components/Notifications.tsx"
import { useCart } from "./hooks/useCart.ts"
import { useCoupons } from "./hooks/useCoupons.ts"
import PageAdmin from "./pages/admin/PageAdmin.tsx"
import PageCart from "./pages/cart/PageCart.tsx"

// 더 이상적인 세분화화와 폴더구조를 해볼 수 있겠지만 basic은 여기까지만 할게요.
const App = () => {
  const { coupons, setCoupons, selectedCoupon, setSelectedCoupon } = useCoupons()
  const { cart, setCart } = useCart()

  const [isAdmin, setIsAdmin] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications />

      <Header isAdmin={isAdmin} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsAdmin={setIsAdmin} cart={cart} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <PageAdmin coupons={coupons} setCoupons={setCoupons} selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} />
        ) : (
          <PageCart
            searchTerm={searchTerm}
            cart={cart}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            setCart={setCart}
          />
        )}
      </main>
    </div>
  )
}

export default App
