import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCoupons } from "../hooks/useCoupons";
import { ProductForm } from "./product/ProductForm";
import { ProductAccordion } from "./product/ProductAccordion";
import { CouponForm } from "./coupon/CouponForm";
import { CouponList } from "./coupon/CouponList";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  // useProducts 훅에서 상품 데이터와 관리 함수들을 가져옵니다.
  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    addProductDiscount,
    removeProductDiscount,
  } = useProducts();

  // useCoupons 훅에서 쿠폰 데이터와 관리 함수들을 가져옵니다.
  const { coupons, addCoupon, removeCoupon } = useCoupons();

  // 상품 삭제 핸들러 (사용자 확인 로직 포함)
  const handleRemoveProduct = (productId: string) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      removeProduct(productId);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>

      {/* 탭 UI */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-medium ${
            activeTab === "products"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          상품 관리
        </button>
        <button
          onClick={() => setActiveTab("coupons")}
          className={`px-4 py-2 font-medium ${
            activeTab === "coupons"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          쿠폰 관리
        </button>
      </div>

      {/* 상품 관리 탭 내용 */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <ProductForm onAddProduct={addProduct} />
          <div className="space-y-3">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductAccordion
                  key={product.id}
                  product={product}
                  onUpdate={updateProduct}
                  onRemove={handleRemoveProduct}
                  onAddDiscount={addProductDiscount}
                  onRemoveDiscount={removeProductDiscount}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                등록된 상품이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 쿠폰 관리 탭 내용 */}
      {activeTab === "coupons" && (
        <div className="space-y-6">
          <CouponForm onAddCoupon={addCoupon} />
          <CouponList coupons={coupons} onRemoveCoupon={removeCoupon} />
        </div>
      )}
    </div>
  );
}
