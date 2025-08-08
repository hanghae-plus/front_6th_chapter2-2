import { Button } from "../../../shared";
import type { ProductWithUI } from "../types";
import { StockBadge } from "./StockBadge";

type ProductTableRowProps = {
  product: ProductWithUI;
  formatPrice: (price: number, productId?: string) => string;
  onEdit: (product: ProductWithUI) => void;
  onDelete: (productId: string) => void;
};

export function ProductTableRow({ product, formatPrice, onEdit, onDelete }: ProductTableRowProps) {
  const handleEdit = () => {
    onEdit(product);
  };

  const handleDelete = () => {
    onDelete(product.id);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
        {product.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {formatPrice(product.price, product.id)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        <StockBadge stock={product.stock} />
      </td>
      <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
        {product.description || "-"}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
        <Button
          onClick={handleEdit}
          color="secondary"
          size="sm"
          className="mr-3 bg-transparent text-indigo-600 hover:bg-indigo-50 hover:text-indigo-900"
        >
          수정
        </Button>
        <Button
          onClick={handleDelete}
          color="secondary"
          size="sm"
          className="bg-transparent text-red-600 hover:bg-red-50 hover:text-red-900"
        >
          삭제
        </Button>
      </td>
    </tr>
  );
}
