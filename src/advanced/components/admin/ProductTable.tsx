import { ProductWithUI, SOLD_OUT_TEXT } from "../../App";
import { useCart } from "../../hooks/useCart";
import { useProductActions, useProducts } from "../../hooks/useProducts";
import { formatPrice, isProductSoldOut } from "../../utils/formatters";
import Button from "../ui/Button";

interface ProductTableProps {
  handleEditProduct: (product: ProductWithUI) => void;
}

const PRODUCT_TABLE_HEADERS = ["상품명", "가격", "재고", "설명", "작업"];

export const ProductTable = ({ handleEditProduct }: ProductTableProps) => {
  const products = useProducts();
  const { cart } = useCart();
  const { deleteProduct } = useProductActions();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {PRODUCT_TABLE_HEADERS.map((header, index) => (
              <th
                key={header}
                className={`px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  index === PRODUCT_TABLE_HEADERS.length - 1
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {isProductSoldOut(product.id, products, cart)
                  ? SOLD_OUT_TEXT
                  : `${formatPrice(product.price)}원`}
              </td>
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
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {product.description || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  onClick={() => handleEditProduct(product)}
                  variant="ghost"
                  className="text-indigo-600 hover:text-indigo-900 mr-3 px-0 py-0"
                >
                  수정
                </Button>
                <Button
                  onClick={() => deleteProduct(product.id)}
                  variant="ghost"
                  className="text-red-600 hover:text-red-900 px-0 py-0"
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
