import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { TabNavigation } from "./TabNavigation";
import { ProductTab } from "./ProductTab";
import { CouponTab } from "./CouponTab";
import {
  productsAtom,
  addProductAtom,
  updateProductAtom,
  deleteProductAtom,
  getRemainingStockAtom,
  addCouponAtom,
  removeCouponAtom,
} from "../../../atoms";

export function AdminPage() {
  const products = useAtomValue(productsAtom);
  const getRemainingStock = useAtomValue(getRemainingStockAtom);
  const addProduct = useSetAtom(addProductAtom);
  const updateProduct = useSetAtom(updateProductAtom);
  const deleteProduct = useSetAtom(deleteProductAtom);
  const addCoupon = useSetAtom(addCouponAtom);
  const removeCoupon = useSetAtom(removeCouponAtom);

  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "products" ? (
        <ProductTab
          products={products}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          getRemainingStock={getRemainingStock}
        />
      ) : (
        <CouponTab onAddCoupon={addCoupon} onDeleteCoupon={removeCoupon} />
      )}
    </div>
  );
}

export default AdminPage;
