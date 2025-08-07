import { ProductWithUI, formatPriceForAdmin } from "../../models/product";
import { getStockStatus } from "../../utils/validators";

interface ProductTableProps {
  products: ProductWithUI[];
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
}

export const ProductTable = ({
  products,
  startEditProduct,
  deleteProduct,
}: ProductTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상품명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              가격
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              재고
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              설명
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatPriceForAdmin(product)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStockStatus(product.stock) === "inStock"
                      ? "bg-green-100 text-green-800"
                      : getStockStatus(product.stock) === "lowStock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock}개
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {product.description || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => startEditProduct(product)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  수정
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
