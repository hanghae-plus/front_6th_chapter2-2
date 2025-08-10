import { useState, useCallback } from "react";
import { ProductWithUI } from "../App";
import { Coupon } from "../../types";
import { priceUtils } from "../utils/priceUtils";
import { useTab } from "../hooks/useTab";
import ProductForm from "../components/admin/ProductForm";
import CouponForm from "../components/admin/CouponForm";

interface AdminPageProps {
  isAdmin: boolean;
  products: ProductWithUI[];
  coupons: Coupon[];
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  notification: {
    add: (message: string, type?: "error" | "success" | "warning") => void;
  };
}

export default function AdminPage({
  isAdmin,
  products,
  coupons,
  addProduct,
  updateProduct,
  deleteProduct,
  addCoupon,
  deleteCoupon,
  notification,
}: AdminPageProps) {
  // 탭 관리
  const { activeTab, setActiveTab } = useTab<"products" | "coupons">(
    "products"
  );

  // 쿠폰 표시 여부 (activeTab === 'coupons')
  const [showCouponForm, setShowCouponForm] = useState(false);

  // 상품 추가 폼 (activeTab ==== 'product')
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  // 폼은 컴포넌트 내부 훅으로 관리

  // [ui] 상품 가격 포맷팅
  const formatPrice = useCallback((price: number) => {
    return priceUtils.formatCurrency(price, false);
  }, []);

  // 상품 추가 핸들러
  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      addProduct(newProduct);
      notification.add("상품이 추가되었습니다.", "success");
    },
    [addProduct, notification.add]
  );

  // 상품 수정 핸들러
  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      updateProduct(productId, updates);
      notification.add("상품이 수정되었습니다.", "success");
    },
    [updateProduct, notification.add]
  );

  // 상품 삭제 핸들러
  const handleDeleteProduct = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      notification.add("상품이 삭제되었습니다.", "success");
    },
    [deleteProduct, notification.add]
  );

  // 쿠폰 추가 핸들러
  const handleAddCoupon = useCallback(
    (newCoupon: Coupon) => {
      addCoupon(newCoupon);
      notification.add("쿠폰이 추가되었습니다.", "success");
    },
    [addCoupon, notification.add]
  );

  // 쿠폰 삭제 핸들러
  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      deleteCoupon(couponCode);
      notification.add("쿠폰이 삭제되었습니다.", "success");
    },
    [deleteCoupon, notification.add]
  );

  // 폼 제출 로직은 컴포넌트에서 값 전달받아 처리

  // 상품 수정 시작
  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setShowProductForm(true);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "products"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "coupons"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === "products" ? (
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              <button
                onClick={() => {
                  setEditingProduct("new");
                  setShowProductForm(true);
                }}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
              >
                새 상품 추가
              </button>
            </div>
          </div>

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
                      {formatPrice(product.price)}
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
                      <button
                        onClick={() => startEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
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
          {showProductForm && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <ProductForm
                mode={editingProduct === "new" ? "new" : "edit"}
                initialValues={
                  editingProduct && editingProduct !== "new"
                    ? products.find((p) => p.id === editingProduct) || undefined
                    : undefined
                }
                onCancel={() => {
                  setEditingProduct(null);
                  setShowProductForm(false);
                }}
                onSubmit={(values) => {
                  if (editingProduct && editingProduct !== "new") {
                    handleUpdateProduct(editingProduct, values);
                  } else {
                    handleAddProduct(values);
                  }
                  setEditingProduct(null);
                  setShowProductForm(false);
                }}
              />
            </div>
          )}
        </section>
      ) : (
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">쿠폰 관리</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {coupon.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 font-mono">
                        {coupon.code}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                          {coupon.discountType === "amount"
                            ? `${coupon.discountValue.toLocaleString()}원 할인`
                            : `${coupon.discountValue}% 할인`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {showCouponForm && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <CouponForm
                  onCancel={() => setShowCouponForm(false)}
                  onSubmit={(values) => {
                    handleAddCoupon(values);
                    setShowCouponForm(false);
                  }}
                  notification={notification}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
