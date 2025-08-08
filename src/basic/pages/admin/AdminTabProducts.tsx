import type { ProductWithUI } from "../../entities/ProductWithUI"
import { AdminProductForm } from "./AdminProductForm"
import { AdminProductTableRow } from "./AdminProductTableRow"

export function AdminTabProducts({
  setEditingProduct,
  setProductForm,
  setShowProductForm,
  activeTab,
  products,
  handleProductStartEdit,
  handleProductDelete,
  showProductForm,
  handleProductSubmit,
  editingProduct,
  productForm,
  handleNotificationAdd,
}: {
  setEditingProduct: (productId: string | null) => void
  setProductForm: (form: {
    name: string
    price: number
    stock: number
    description: string
    discounts: Array<{ quantity: number; rate: number }>
  }) => void
  setShowProductForm: (show: boolean) => void
  activeTab: string
  products: ProductWithUI[]
  handleProductStartEdit: (product: ProductWithUI) => void
  handleProductDelete: (productId: string) => void
  showProductForm: boolean
  handleProductSubmit: (e: React.FormEvent) => void
  editingProduct: string | null
  productForm: { name: string; price: number; stock: number; description: string; discounts: Array<{ quantity: number; rate: number }> }
  handleNotificationAdd: (message: string, type: "error" | "success" | "warning") => void
}) {
  function handleProductAdd() {
    setEditingProduct("new")
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    })
    setShowProductForm(true)
  }

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800" onClick={handleProductAdd}>
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">재고</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(activeTab === "products" ? products : products).map((product) => (
              <AdminProductTableRow
                key={product.id}
                product={product}
                products={products}
                handleProductStartEdit={handleProductStartEdit}
                handleProductDelete={handleProductDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
      {showProductForm && (
        <AdminProductForm
          handleProductSubmit={handleProductSubmit}
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          handleNotificationAdd={handleNotificationAdd}
          setEditingProduct={setEditingProduct}
          setShowProductForm={setShowProductForm}
        />
      )}
    </section>
  )
}
