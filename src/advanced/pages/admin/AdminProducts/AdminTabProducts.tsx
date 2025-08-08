import { useState } from "react"
import type { ProductViewModel } from "../../../entities/ProductViewModel"
import { AdminProductForm } from "./AdminProductForm"
import { AdminProductTableRow } from "./AdminProductTableRow"

export function AdminTabProducts({
  products,
  setProducts,
  handleNotificationAdd,
}: {
  products: ProductViewModel[]
  setProducts: React.Dispatch<React.SetStateAction<ProductViewModel[]>>
  handleNotificationAdd: (message: string, type: "error" | "success" | "warning") => void
}) {
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  })

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
            {products.map((product) => (
              <AdminProductTableRow
                key={product.id}
                product={product}
                setEditingProduct={setEditingProduct}
                setProductForm={setProductForm}
                setShowProductForm={setShowProductForm}
                setProducts={setProducts}
                handleNotificationAdd={handleNotificationAdd}
              />
            ))}
          </tbody>
        </table>
      </div>
      {showProductForm && (
        <AdminProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          handleNotificationAdd={handleNotificationAdd}
          setEditingProduct={setEditingProduct}
          setShowProductForm={setShowProductForm}
          setProducts={setProducts}
        />
      )}
    </section>
  )
}
