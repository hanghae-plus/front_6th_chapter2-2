import { ProductWithUI } from "../../../entities/products/product.types";
import { useProductHandlers } from "../../../entities/products/useProductHandlers";
import { useCartHandlers } from "../../../entities/cart/useCartHandlers";
import { useProductUtils } from "../../../entities/products/useProductUtils";
import { useNotifications } from "../../../hooks/useNotifications";
import { formatPrice } from "../../../utils/formatters";
import { STOCK } from "../../../constants";

interface ProductTableProps {
  onEditProduct: (product: ProductWithUI) => void;
  onAddProduct: () => void;
}

export const ProductTable = ({
  onEditProduct,
  onAddProduct,
}: ProductTableProps) => {
  // Hooks를 직접 사용
  const { addNotification } = useNotifications();
  const productHandlers = useProductHandlers({ addNotification });
  const cartHandlers = useCartHandlers({ addNotification });

  const productUtils = useProductUtils({
    products: productHandlers.state.items,
    cart: cartHandlers.state.items,
  });

  const handleDeleteProduct = (productId: string) => {
    productHandlers.actions.remove(productId);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">상품 관리</h2>
        <button
          onClick={onAddProduct}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          새 상품 추가
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
                할인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productHandlers.state.items.map((product) => {
              const isSoldOut = productUtils.checkSoldOutByProductId(
                product.id
              );
              const isLowStock = product.stock <= STOCK.LOW_STOCK_THRESHOLD;

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(product.price, isSoldOut, true)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isSoldOut
                          ? "bg-red-100 text-red-800"
                          : isLowStock
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.stock}개
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.discounts.length > 0 ? (
                      <div className="space-y-1">
                        {product.discounts.map((discount, index) => (
                          <div key={index} className="text-xs">
                            {discount.quantity}개+{" "}
                            {(discount.rate * 100).toFixed(0)}%
                          </div>
                        ))}
                      </div>
                    ) : (
                      "없음"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isSoldOut
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isSoldOut ? "품절" : "판매중"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {productHandlers.state.items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">등록된 상품이 없습니다.</p>
            <button
              onClick={onAddProduct}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              첫 상품 추가하기
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
