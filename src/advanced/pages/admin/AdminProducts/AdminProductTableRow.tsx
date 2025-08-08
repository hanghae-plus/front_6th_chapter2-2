import type { ProductViewModel } from "../../../entities/ProductViewModel"
import { useApp } from "../../../hooks/useApp"
import { useNotification } from "../../../hooks/useNotification"
import { useProductForm } from "../../../hooks/useProductForm"
import { useProducts } from "../../../hooks/useProducts"

export function AdminProductTableRow({ product }: { product: ProductViewModel }) {
  const { setProducts } = useProducts()
  const { handleNotificationAdd } = useNotification()
  const { setShowProductForm } = useApp()
  const { setEditingProduct, setProductForm } = useProductForm()

  const formattedPrice = `${product.price.toLocaleString()}원`

  function handleProductStartEdit(product: ProductViewModel) {
    setEditingProduct("edit")
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
      isRecommended: product.isRecommended,
    })
    setShowProductForm(true)
  }

  function handleProductDelete(product: ProductViewModel) {
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
    handleNotificationAdd("상품이 삭제되었습니다.", "success")
  }

  return (
    <tr key={product.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedPrice}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stock > 10
              ? "bg-green-100 text-green-800"
              : product.stock > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {product.stock}개
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || "-"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => handleProductStartEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-3">
          수정
        </button>

        <button onClick={() => handleProductDelete(product)} className="text-red-600 hover:text-red-900">
          삭제
        </button>
      </td>
    </tr>
  )
}
