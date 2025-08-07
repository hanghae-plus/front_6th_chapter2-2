import { useAtomValue, useSetAtom } from "jotai";
import { productsAtom, updateProductAtom } from "../../../stores/productStore";
import { addNotificationAtom } from "../../../stores/notificationStore";
import { withTryNotifySuccess } from "../../../utils/withNotify";
import type { NotificationType } from "../../../types/admin";
import { Product } from "../../../../types";

export default function InventoryManagementFeature() {
  const products = useAtomValue(productsAtom);
  const updateProductSet = useSetAtom(updateProductAtom);
  const addNotificationSet = useSetAtom(addNotificationAtom);

  const handleUpdateStock = withTryNotifySuccess(
    (productId: string, newStock: number) => updateProductSet({ productId, updates: { stock: newStock } }),
    "재고가 업데이트되었습니다.",
    (message: string, type: NotificationType) => addNotificationSet({ message, type })
  );

  const lowStockProducts = products.filter((product) => product.stock < 10);
  const outOfStockProducts = products.filter((product) => product.stock === 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">재고 현황</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">전체 상품</h3>
            <p className="text-2xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-900">부족 재고</h3>
            <p className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium text-red-900">품절</h3>
            <p className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">재고 부족 상품</h3>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">현재 재고: {product.stock}개</p>
                  </div>
                  <button
                    onClick={() => handleUpdateStock(product.id, product.stock + 10)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    +10 추가
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">재고 부족 상품이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
