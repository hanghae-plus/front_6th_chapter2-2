import { IProductWithUI } from "../../type";
import { formatPrice } from "../../utils/formatters";
import ProductTableItem from "./ProductTableItem";

interface ProductTableProps {
  products: IProductWithUI[];
  getRemainingStock: (product: IProductWithUI) => number;
  startEditProduct: (product: IProductWithUI) => void;
  deleteProductItem: (productId: string) => void;
}

const ProductTable = ({
  products,
  getRemainingStock,
  startEditProduct,
  deleteProductItem,
}: ProductTableProps) => {
  // 가격 텍스트 처리
  const getPriceText = (item: IProductWithUI) => {
    if (item && getRemainingStock(item) <= 0) return "SOLD OUT";
    return formatPrice(item.price, "won");
  };

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
          {/* 기존 상품 목록 */}
          {products.map((product) => (
            <ProductTableItem
              key={product.id}
              product={product}
              priceText={getPriceText(product)}
              startEditProduct={startEditProduct}
              deleteProductItem={deleteProductItem}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
