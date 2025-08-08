import React, { useState } from "react";
import { ProductWithUI } from "../../../domain/product/models";
import { Coupon } from "../../../domain/coupon/models";

interface AdminPanelProps {
  // Product 관련
  products: ProductWithUI[];
  editingProduct: string | null;
  showProductForm: boolean;
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  };
  addProduct: (product: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  }) => void;
  updateProduct: (
    id: string,
    product: {
      name: string;
      price: number;
      stock: number;
      description: string;
      discounts: Array<{ quantity: number; rate: number }>;
    }
  ) => void;
  deleteProduct: (id: string) => void;
  startEditProduct: (product: ProductWithUI) => void;
  setEditingProduct: (id: string | null) => void;
  setShowProductForm: (show: boolean) => void;
  setProductForm: (form: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  }) => void;

  // Coupon 관련
  coupons: Coupon[];
  showCouponForm: boolean;
  couponForm: {
    name: string;
    code: string;
    discountType: "amount" | "percentage";
    discountValue: number;
  };
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  handleCouponSubmit: (e: React.FormEvent) => void;
  setShowCouponForm: (show: boolean) => void;
  setCouponForm: (form: {
    name: string;
    code: string;
    discountType: "amount" | "percentage";
    discountValue: number;
  }) => void;

  // 기타
  formatPrice: (price: number, productId?: string) => string;
  handleProductSubmit: (e: React.FormEvent) => void;
  addNotification: (
    message: string,
    type?: "success" | "error" | "warning"
  ) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  editingProduct,
  showProductForm,
  productForm,
  deleteProduct,
  startEditProduct,
  setEditingProduct,
  setShowProductForm,
  setProductForm,
  coupons,
  showCouponForm,
  couponForm,
  deleteCoupon,
  handleCouponSubmit,
  setShowCouponForm,
  setCouponForm,
  formatPrice,
  handleProductSubmit,
  addNotification,
}) => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

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
                  setProductForm({
                    name: "",
                    price: 0,
                    stock: 0,
                    description: "",
                    discounts: [],
                  });
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
                      {formatPrice(product.price, product.id)}
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
                        onClick={() => deleteProduct(product.id)}
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
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상품명
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설명
                    </label>
                    <input
                      type="text"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      가격
                    </label>
                    <input
                      type="text"
                      value={productForm.price === 0 ? "" : productForm.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          setProductForm({
                            ...productForm,
                            price: value === "" ? 0 : parseInt(value),
                          });
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setProductForm({ ...productForm, price: 0 });
                        } else if (parseInt(value) < 0) {
                          addNotification("가격은 0보다 커야 합니다", "error");
                          setProductForm({ ...productForm, price: 0 });
                        }
                      }}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                      placeholder="숫자만 입력"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      재고
                    </label>
                    <input
                      type="text"
                      value={productForm.stock === 0 ? "" : productForm.stock}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          setProductForm({
                            ...productForm,
                            stock: value === "" ? 0 : parseInt(value),
                          });
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setProductForm({ ...productForm, stock: 0 });
                        } else if (parseInt(value) < 0) {
                          addNotification("재고는 0보다 커야 합니다", "error");
                          setProductForm({ ...productForm, stock: 0 });
                        } else if (parseInt(value) > 9999) {
                          addNotification(
                            "재고는 9999개를 초과할 수 없습니다",
                            "error"
                          );
                          setProductForm({ ...productForm, stock: 9999 });
                        }
                      }}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                      placeholder="숫자만 입력"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    할인 정책
                  </label>
                  <div className="space-y-2">
                    {productForm.discounts.map((discount, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="number"
                          value={discount.quantity}
                          onChange={(e) => {
                            const newDiscounts = [...productForm.discounts];
                            newDiscounts[index].quantity =
                              parseInt(e.target.value) || 0;
                            setProductForm({
                              ...productForm,
                              discounts: newDiscounts,
                            });
                          }}
                          className="w-20 px-2 py-1 border rounded"
                          min="1"
                          placeholder="수량"
                        />
                        <span className="text-sm">개 이상 구매 시</span>
                        <input
                          type="number"
                          value={discount.rate * 100}
                          onChange={(e) => {
                            const newDiscounts = [...productForm.discounts];
                            newDiscounts[index].rate =
                              (parseInt(e.target.value) || 0) / 100;
                            setProductForm({
                              ...productForm,
                              discounts: newDiscounts,
                            });
                          }}
                          className="w-16 px-2 py-1 border rounded"
                          min="0"
                          max="100"
                          placeholder="%"
                        />
                        <span className="text-sm">% 할인</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newDiscounts = productForm.discounts.filter(
                              (_, i) => i !== index
                            );
                            setProductForm({
                              ...productForm,
                              discounts: newDiscounts,
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setProductForm({
                          ...productForm,
                          discounts: [
                            ...productForm.discounts,
                            { quantity: 10, rate: 0.1 },
                          ],
                        });
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + 할인 추가
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        price: 0,
                        stock: 0,
                        description: "",
                        discounts: [],
                      });
                      setShowProductForm(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    {editingProduct === "new" ? "추가" : "수정"}
                  </button>
                </div>
              </form>
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
                      onClick={() => deleteCoupon(coupon.code)}
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
                <form onSubmit={handleCouponSubmit} className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">
                    새 쿠폰 생성
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        쿠폰명
                      </label>
                      <input
                        type="text"
                        value={couponForm.name}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                        placeholder="신규 가입 쿠폰"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        쿠폰 코드
                      </label>
                      <input
                        type="text"
                        value={couponForm.code}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
                        placeholder="WELCOME2024"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        할인 타입
                      </label>
                      <select
                        value={couponForm.discountType}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            discountType: e.target.value as
                              | "amount"
                              | "percentage",
                          })
                        }
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                      >
                        <option value="amount">정액 할인</option>
                        <option value="percentage">정률 할인</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {couponForm.discountType === "amount"
                          ? "할인 금액"
                          : "할인율(%)"}
                      </label>
                      <input
                        type="text"
                        value={
                          couponForm.discountValue === 0
                            ? ""
                            : couponForm.discountValue
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setCouponForm({
                              ...couponForm,
                              discountValue: value === "" ? 0 : parseInt(value),
                            });
                          }
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          if (couponForm.discountType === "percentage") {
                            if (value > 100) {
                              addNotification(
                                "할인율은 100%를 초과할 수 없습니다",
                                "error"
                              );
                              setCouponForm({
                                ...couponForm,
                                discountValue: 100,
                              });
                            } else if (value < 0) {
                              setCouponForm({
                                ...couponForm,
                                discountValue: 0,
                              });
                            }
                          } else {
                            if (value > 100000) {
                              addNotification(
                                "할인 금액은 100,000원을 초과할 수 없습니다",
                                "error"
                              );
                              setCouponForm({
                                ...couponForm,
                                discountValue: 100000,
                              });
                            } else if (value < 0) {
                              setCouponForm({
                                ...couponForm,
                                discountValue: 0,
                              });
                            }
                          }
                        }}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                        placeholder={
                          couponForm.discountType === "amount" ? "5000" : "10"
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCouponForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                      쿠폰 생성
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
