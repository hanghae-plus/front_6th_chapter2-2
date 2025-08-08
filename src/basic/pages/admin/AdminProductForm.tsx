import { ProductsDiscount } from "./ProductsDiscount"

export function AdminProductForm({
  handleProductSubmit,
  editingProduct,
  productForm,
  setProductForm,
  handleNotificationAdd,
  setEditingProduct,
  setShowProductForm,
}: {
  handleProductSubmit: (e: React.FormEvent) => void
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
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  name: e.target.value,
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <input
              type="text"
              value={productForm.description}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  description: e.target.value,
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
            <input
              type="text"
              value={productForm.price === 0 ? "" : productForm.price}
              onChange={(e) => {
                const value = e.target.value
                if (value === "" || /^\d+$/.test(value)) {
                  setProductForm({
                    ...productForm,
                    price: value === "" ? 0 : parseInt(value),
                  })
                }
              }}
              onBlur={(e) => {
                const value = e.target.value
                if (value === "") {
                  setProductForm({ ...productForm, price: 0 })
                } else if (parseInt(value) < 0) {
                  handleNotificationAdd("가격은 0보다 커야 합니다", "error")
                  setProductForm({ ...productForm, price: 0 })
                }
              }}
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
              onChange={(e) => {
                const value = e.target.value
                if (value === "" || /^\d+$/.test(value)) {
                  setProductForm({
                    ...productForm,
                    stock: value === "" ? 0 : parseInt(value),
                  })
                }
              }}
              onBlur={(e) => {
                const value = e.target.value
                if (value === "") {
                  setProductForm({ ...productForm, stock: 0 })
                } else if (parseInt(value) < 0) {
                  handleNotificationAdd("재고는 0보다 커야 합니다", "error")
                  setProductForm({ ...productForm, stock: 0 })
                } else if (parseInt(value) > 9999) {
                  handleNotificationAdd("재고는 9999개를 초과할 수 없습니다", "error")
                  setProductForm({ ...productForm, stock: 9999 })
                }
              }}
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
              <ProductsDiscount key={index} index={index} discount={discount} productForm={productForm} setProductForm={setProductForm} />
            ))}
            <button
              type="button"
              onClick={() => {
                setProductForm({
                  ...productForm,
                  discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
                })
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null)
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              })
              setShowProductForm(false)
            }}
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
