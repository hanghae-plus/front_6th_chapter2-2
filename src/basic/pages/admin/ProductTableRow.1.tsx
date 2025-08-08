import type { ProductWithUI } from "../../entities/ProductWithUI"
import { formatPrice } from "../../utils/formatPrice"

export function ProductTableRow({
  product,
  products,
  handleProductStartEdit,
  handleProductDelete,
}: {
  product: ProductWithUI
  products: ProductWithUI[]
  handleProductStartEdit: (product: ProductWithUI) => void
  handleProductDelete: (productId: string) => void
}) {
  return (
    <tr key={product.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(product.price, product.id, products, [], true)}</td>
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
        <button onClick={() => handleProductDelete(product.id)} className="text-red-600 hover:text-red-900">
          삭제
        </button>
      </td>
    </tr>
  )
}
