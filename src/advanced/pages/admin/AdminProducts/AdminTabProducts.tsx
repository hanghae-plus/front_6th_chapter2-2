import { useProducts } from "../../../hooks/useProducts"
import { AdminProductForm } from "./AdminProductForm"
import { AdminProductTableRow } from "./AdminProductTableRow"
import { useApp } from "../../../hooks/useApp"
import { useProductForm } from "../../../hooks/useProductForm"

export function AdminTabProducts() {
  const { products } = useProducts()
  const { showProductForm, setShowProductForm } = useApp()
  const { setProductForm, setEditingProduct } = useProductForm()

  function handleProductAdd() {
    setEditingProduct(null)
    setProductForm({
      id: "",
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
      isRecommended: false,
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
            {products.map((product) => (
              <AdminProductTableRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      {showProductForm && <AdminProductForm />}
    </section>
  )
}
