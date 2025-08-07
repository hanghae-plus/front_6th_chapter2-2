import { Button } from "../ui/button/Button";
import { Product } from "../../../types";
import { formatPriceWithStock } from "../../utils/formatters";

interface ProductTableRowProps {
  product: Product;
  remainingStock: number;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductTableRow = ({ product, remainingStock, onEdit, onDelete }: ProductTableRowProps) => {
  const getStockBadgeClass = (stock: number) => {
    if (stock > 10) return "bg-green-100 text-green-800";
    if (stock > 0) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatPriceWithStock(product.price, remainingStock, true)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockBadgeClass(
            product.stock
          )}`}
        >
          {product.stock}개
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || "-"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(product)}
          className="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          수정
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(product.id)}
          className="text-red-600 hover:text-red-900"
        >
          삭제
        </Button>
      </td>
    </tr>
  );
};
