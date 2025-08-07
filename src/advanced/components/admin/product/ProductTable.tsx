import { useAtom } from "jotai";
import { isAdminAtom } from "../../../atoms/adminAtoms";
import { ProductWithUI } from "../../../types/product";
import { formatPrice, getStockStatusStyle, PRODUCT_TABLE_HEADERS } from "../../../utils/productUtils";

interface IProductTableProps {
  products: ProductWithUI[];
  getRemainingStock: (product: ProductWithUI) => number;
  editProductForm: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
}

const ProductTable = ({ products, getRemainingStock, editProductForm, deleteProduct }: IProductTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {PRODUCT_TABLE_HEADERS.map((header) => (
              <th key={header.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* 상품 목록 렌더링 */}
          {products.map((product) => (
            <ProductTableRow key={product.id} product={product} products={products} getRemainingStock={getRemainingStock} editProductForm={editProductForm} deleteProduct={deleteProduct} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

interface IProductTableRowProps {
  product: ProductWithUI;
  products: ProductWithUI[];
  getRemainingStock: (product: ProductWithUI) => number;
  editProductForm: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
}

export const ProductTableRow = ({ product, products, getRemainingStock, editProductForm, deleteProduct }: IProductTableRowProps) => {
  /** 관리자 모드 여부 - Jotai 사용 */
  const [isAdmin] = useAtom(isAdminAtom);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(product.price, isAdmin, { productId: product.id, products, getRemainingStock })}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusStyle(product.stock)}`}>{product.stock}개</span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description || "-"}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => editProductForm(product)} className="text-indigo-600 hover:text-indigo-900 mr-3">
          수정
        </button>
        <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900">
          삭제
        </button>
      </td>
    </tr>
  );
};
