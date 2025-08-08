import type { ProductViewModel } from "../../../entities/ProductViewModel"
import { AdminProductsDiscount } from "./AdminProductsDiscount.tsx"

export function AdminProductForm({
  setProducts,
  editingProduct,
  productForm,
  setProductForm,
  handleNotificationAdd,
  setEditingProduct,
  setShowProductForm,
}: {
  setProducts: React.Dispatch<React.SetStateAction<ProductViewModel[]>>
  editingProduct: string | null
  productForm: { name: string; price: number; stock: number; description: string; discounts: Array<{ quantity: number; rate: number }> }
  setProductForm: (form: {
    name: string
    price: number
    stock: number
    description: string
    discounts: Array<{ quantity: number; rate: number }>
  }) => void
  handleNotificationAdd: (message: string, type: "error" | "success" | "warning") => void
  setEditingProduct: (productId: string | null) => void
  setShowProductForm: (show: boolean) => void
}) {
  // 새 상품을 추가
  function handleProductAdd(newProduct: Omit<ProductViewModel, "id">) {
    const product: ProductViewModel = {
      ...newProduct,
      id: `p${Date.now()}`,
    }
    setProducts((prev) => [...prev, product])
    handleNotificationAdd("상품이 추가되었습니다.", "success")
  }

  // 상품명 변경
  function handleProductNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProductForm({ ...productForm, name: e.target.value })
  }

  // 상품 설명 변경
  function handleProductDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProductForm({ ...productForm, description: e.target.value })
  }

  // 가격 입력
  function handleProductPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === "" || /^\d+$/.test(value)) {
      setProductForm({ ...productForm, price: value === "" ? 0 : parseInt(value) })
    }
  }

  // 가격 입력 (유효성 검사)
  function handleProductPriceBlur(e: React.FocusEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === "") {
      setProductForm({ ...productForm, price: 0 })
    } else if (parseInt(value) < 0) {
      handleNotificationAdd("가격은 0보다 커야 합니다", "error")
      setProductForm({ ...productForm, price: 0 })
    }
  }

  // 할인 정책 추가
  function handleAddDiscount() {
    setProductForm({ ...productForm, discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }] })
  }

  // 재고 입력
  function handleStockChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === "" || /^\d+$/.test(value)) {
      setProductForm({
        ...productForm,
        stock: value === "" ? 0 : parseInt(value),
      })
    }
  }

  // 재고 입력 (유효성 검사)
  function handleStockBlur(e: React.FocusEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === "") {
      setProductForm({ ...productForm, stock: 0 })
    } else if (parseInt(value) < 0) {
      handleNotificationAdd("재고는 0보다 커야 합니다", "error")
      setProductForm({ ...productForm, stock: 0 })
    }
  }

  // 취소 버튼 클릭
  function handleClickCancel() {
    setEditingProduct(null)
    setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] })
    setShowProductForm(false)
  }

  // 폼 제출 (상품 추가/수정)
  function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (editingProduct && editingProduct !== "new") {
      // 기존 상품 수정
      setProducts((prev) => prev.map((product) => (product.id === editingProduct ? { ...product, ...productForm } : product)))
      handleNotificationAdd("상품이 수정되었습니다.", "success")
      setEditingProduct(null)
    } else {
      // 새 상품 추가
      handleProductAdd({ ...productForm, discounts: productForm.discounts })
    }

    // 폼 초기화
    setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] })
    setEditingProduct(null)
    setShowProductForm(false)
  }

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{editingProduct === "new" ? "새 상품 추가" : "상품 수정"}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
            <input
              type="text"
              value={productForm.name}
              onChange={handleProductNameChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <input
              type="text"
              value={productForm.description}
              onChange={handleProductDescriptionChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
            <input
              type="text"
              value={productForm.price === 0 ? "" : productForm.price}
              onChange={handleProductPriceChange}
              onBlur={handleProductPriceBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
            <input
              type="text"
              value={productForm.stock === 0 ? "" : productForm.stock}
              onChange={handleStockChange}
              onBlur={handleStockBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
          <div className="space-y-2">
            {productForm.discounts.map((discount, index) => (
              <AdminProductsDiscount
                key={index}
                index={index}
                discount={discount}
                productForm={productForm}
                setProductForm={setProductForm}
              />
            ))}
            <button type="button" className="text-sm text-indigo-600 hover:text-indigo-800" onClick={handleAddDiscount}>
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClickCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>

          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            {editingProduct === "new" ? "추가" : "수정"}
          </button>
        </div>
      </form>
    </div>
  )
}
