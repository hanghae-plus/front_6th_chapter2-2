import { useState } from "react"
import { Coupon } from "../../../types.ts"
import { ProductViewModel } from "../../entities/ProductViewModel.ts"
import { AdminTabCoupons } from "./AdminCoupons/AdminTabCoupons.tsx"
import { AdminTabProducts } from "./AdminProducts/AdminTabProducts.tsx"

interface PageAdminProps {
  products: ProductViewModel[]
  setProducts: React.Dispatch<React.SetStateAction<ProductViewModel[]>>
  handleNotificationAdd: (message: string, type: "error" | "success" | "warning") => void
  coupons: Coupon[]
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>
  selectedCoupon: Coupon | null
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>
}

function PageAdmin({
  products,
  setProducts,
  handleNotificationAdd,
  coupons,
  setCoupons,
  selectedCoupon,
  setSelectedCoupon,
}: PageAdminProps) {
  // Admin
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products")

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "products"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("products")}
          >
            상품 관리
          </button>

          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "coupons"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("coupons")}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === "products" ? (
        <AdminTabProducts products={products} setProducts={setProducts} handleNotificationAdd={handleNotificationAdd} />
      ) : (
        <AdminTabCoupons
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          setCoupons={setCoupons}
          setSelectedCoupon={setSelectedCoupon}
          handleNotificationAdd={handleNotificationAdd}
        />
      )}
    </div>
  )
}

export default PageAdmin
