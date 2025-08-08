import { Coupon } from "../../../types.ts"
import { useCallback, useState } from "react"
import { ProductWithUI } from "../../entities/ProductWithUI.ts"
import { AdminTabProducts } from "./AdminTabProducts.tsx"
import { AdminTabCoupons } from "./AdminTabCoupons.tsx"

interface PageAdminProps {
  products: ProductWithUI[]
  setProducts: (products: ProductWithUI[] | ((prev: ProductWithUI[]) => ProductWithUI[])) => void
  handleNotificationAdd: (message: string, type: "error" | "success" | "warning") => void
  coupons: Coupon[]
  setCoupons: (coupons: Coupon[] | ((prev: Coupon[]) => Coupon[])) => void
  selectedCoupon: Coupon | null
  setSelectedCoupon: (coupon: Coupon | null) => void
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
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products")
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  })

  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  })

  const handleProductAdd = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      }
      setProducts((prev) => [...prev, product])
      handleNotificationAdd("상품이 추가되었습니다.", "success")
    },
    [handleNotificationAdd],
  )

  const handleProductUpdate = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, ...updates } : product)))
      handleNotificationAdd("상품이 수정되었습니다.", "success")
    },
    [handleNotificationAdd],
  )

  const handleCouponAdd = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code)
      if (existingCoupon) {
        handleNotificationAdd("이미 존재하는 쿠폰 코드입니다.", "error")
        return
      }
      setCoupons((prev) => [...prev, newCoupon])
      handleNotificationAdd("쿠폰이 추가되었습니다.", "success")
    },
    [coupons, handleNotificationAdd],
  )

  const handleProductDelete = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      handleNotificationAdd("상품이 삭제되었습니다.", "success")
    },
    [handleNotificationAdd],
  )

  const handleCouponDelete = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode))
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null)
      }
      handleNotificationAdd("쿠폰이 삭제되었습니다.", "success")
    },
    [selectedCoupon, handleNotificationAdd],
  )

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct && editingProduct !== "new") {
      handleProductUpdate(editingProduct, productForm)
      setEditingProduct(null)
    } else {
      handleProductAdd({
        ...productForm,
        discounts: productForm.discounts,
      })
    }
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    })
    setEditingProduct(null)
    setShowProductForm(false)
  }

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCouponAdd(couponForm)
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    })
    setShowCouponForm(false)
  }

  const handleProductStartEdit = (product: ProductWithUI) => {
    setEditingProduct(product.id)
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    })
    setShowProductForm(true)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "products"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "coupons"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === "products" ? (
        <AdminTabProducts
          setEditingProduct={setEditingProduct}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
          activeTab={activeTab}
          products={products}
          handleProductStartEdit={handleProductStartEdit}
          handleProductDelete={handleProductDelete}
          showProductForm={showProductForm}
          handleProductSubmit={handleProductSubmit}
          editingProduct={editingProduct}
          productForm={productForm}
          handleNotificationAdd={handleNotificationAdd}
        />
      ) : (
        <AdminTabCoupons
          coupons={coupons}
          handleCouponDelete={handleCouponDelete}
          setShowCouponForm={setShowCouponForm}
          showCouponForm={showCouponForm}
          handleCouponSubmit={handleCouponSubmit}
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          handleNotificationAdd={handleNotificationAdd}
        />
      )}
    </div>
  )
}

export default PageAdmin
