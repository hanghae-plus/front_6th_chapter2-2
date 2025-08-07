import { FormEvent } from "react";

import type { Coupon, Product } from "../../../types";
import { Button, CloseIcon, PlusIcon, SearchInput, TrashIcon } from "../../shared";

interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

type ProductForm = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

type CouponForm = {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

type AdminPageProps = {
  setActiveTab: (tab: "products" | "coupons") => void;
  activeTab: "products" | "coupons";
  setEditingProduct: (id: string | null) => void;
  setProductForm: (form: ProductForm) => void;
  setShowProductForm: (show: boolean) => void;
  products: ProductWithUI[];
  formatPrice: (price: number, productId?: string) => string;
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
  showProductForm: boolean;
  handleProductSubmit: (e: FormEvent) => void;
  editingProduct: string | null;
  productForm: ProductForm;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
  coupons: Coupon[];
  deleteCoupon: (couponCode: string) => void;
  setShowCouponForm: (show: boolean) => void;
  showCouponForm: boolean;
  handleCouponSubmit: (e: FormEvent) => void;
  couponForm: CouponForm;
  setCouponForm: (form: CouponForm) => void;
};

export function AdminPage({
  setProductForm,
  setShowProductForm,
  products,
  formatPrice,
  startEditProduct,
  deleteProduct,
  showProductForm,
  handleProductSubmit,
  editingProduct,
  productForm,
  addNotification,
  coupons,
  deleteCoupon,
  setShowCouponForm,
  showCouponForm,
  handleCouponSubmit,
  couponForm,
  setCouponForm,
  activeTab,
  setActiveTab,
  setEditingProduct
}: AdminPageProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="mt-1 text-gray-600">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
              activeTab === "products"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
              activeTab === "coupons"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === "products" ? (
        <section className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              <Button
                onClick={() => {
                  setEditingProduct("new");
                  setProductForm({
                    name: "",
                    price: 0,
                    stock: 0,
                    description: "",
                    discounts: []
                  });
                  setShowProductForm(true);
                }}
                color="dark"
                className="rounded-md text-sm"
              >
                새 상품 추가
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    상품명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    재고
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    설명
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {(activeTab === "products" ? products : products).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatPrice(product.price, product.id)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
                      {product.description || "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Button
                        onClick={() => startEditProduct(product)}
                        color="secondary"
                        size="sm"
                        className="mr-3 bg-transparent text-indigo-600 hover:bg-indigo-50 hover:text-indigo-900"
                      >
                        수정
                      </Button>
                      <Button
                        onClick={() => deleteProduct(product.id)}
                        color="secondary"
                        size="sm"
                        className="bg-transparent text-red-600 hover:bg-red-50 hover:text-red-900"
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showProductForm && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <SearchInput
                      type="text"
                      label="상품명"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <SearchInput
                      type="text"
                      label="설명"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({ ...productForm, description: e.target.value })
                      }
                      className="shadow-sm"
                    />
                  </div>
                  <div>
                    <SearchInput
                      type="text"
                      label="가격"
                      value={productForm.price === 0 ? "" : productForm.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          setProductForm({
                            ...productForm,
                            price: value === "" ? 0 : parseInt(value)
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
                      className="shadow-sm"
                      placeholder="숫자만 입력"
                      required
                    />
                  </div>
                  <div>
                    <SearchInput
                      type="text"
                      label="재고"
                      value={productForm.stock === 0 ? "" : productForm.stock}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          setProductForm({
                            ...productForm,
                            stock: value === "" ? 0 : parseInt(value)
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
                          addNotification("재고는 9999개를 초과할 수 없습니다", "error");
                          setProductForm({ ...productForm, stock: 9999 });
                        }
                      }}
                      className="shadow-sm"
                      placeholder="숫자만 입력"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">할인 정책</label>
                  <div className="space-y-2">
                    {productForm.discounts.map((discount, index) => (
                      <div key={index} className="flex items-center gap-2 rounded bg-gray-50 p-2">
                        <input
                          type="number"
                          value={discount.quantity}
                          onChange={(e) => {
                            const newDiscounts = [...productForm.discounts];
                            newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                            setProductForm({ ...productForm, discounts: newDiscounts });
                          }}
                          className="w-20 rounded border px-2 py-1"
                          min="1"
                          placeholder="수량"
                        />
                        <span className="text-sm">개 이상 구매 시</span>
                        <input
                          type="number"
                          value={discount.rate * 100}
                          onChange={(e) => {
                            const newDiscounts = [...productForm.discounts];
                            newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                            setProductForm({ ...productForm, discounts: newDiscounts });
                          }}
                          className="w-16 rounded border px-2 py-1"
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
                            setProductForm({ ...productForm, discounts: newDiscounts });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setProductForm({
                          ...productForm,
                          discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }]
                        });
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + 할인 추가
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        price: 0,
                        stock: 0,
                        description: "",
                        discounts: []
                      });
                      setShowProductForm(false);
                    }}
                    color="secondary"
                  >
                    취소
                  </Button>
                  <Button type="submit" color="primary">
                    {editingProduct === "new" ? "추가" : "수정"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold">쿠폰 관리</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="relative rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                      <p className="mt-1 font-mono text-sm text-gray-600">{coupon.code}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-indigo-700">
                          {coupon.discountType === "amount"
                            ? `${coupon.discountValue.toLocaleString()}원 할인`
                            : `${coupon.discountValue}% 할인`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-gray-400 transition-colors hover:text-red-600"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-gray-400">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="flex flex-col items-center text-gray-400 hover:text-gray-600"
                >
                  <PlusIcon />
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {showCouponForm && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <form onSubmit={handleCouponSubmit} className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <SearchInput
                        type="text"
                        label="쿠폰명"
                        value={couponForm.name}
                        onChange={(e) => setCouponForm({ ...couponForm, name: e.target.value })}
                        className="text-sm shadow-sm"
                        placeholder="신규 가입 쿠폰"
                        required
                      />
                    </div>
                    <div>
                      <SearchInput
                        type="text"
                        label="쿠폰 코드"
                        value={couponForm.code}
                        onChange={(e) =>
                          setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                        }
                        className="font-mono text-sm shadow-sm"
                        placeholder="WELCOME2024"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        할인 타입
                      </label>
                      <select
                        value={couponForm.discountType}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            discountType: e.target.value as "amount" | "percentage"
                          })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="amount">정액 할인</option>
                        <option value="percentage">정률 할인</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        {couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
                      </label>
                      <SearchInput
                        type="text"
                        label={couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
                        value={couponForm.discountValue === 0 ? "" : couponForm.discountValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setCouponForm({
                              ...couponForm,
                              discountValue: value === "" ? 0 : parseInt(value)
                            });
                          }
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          if (couponForm.discountType === "percentage") {
                            if (value > 100) {
                              addNotification("할인율은 100%를 초과할 수 없습니다", "error");
                              setCouponForm({ ...couponForm, discountValue: 100 });
                            } else if (value < 0) {
                              setCouponForm({ ...couponForm, discountValue: 0 });
                            }
                          } else {
                            if (value > 100000) {
                              addNotification(
                                "할인 금액은 100,000원을 초과할 수 없습니다",
                                "error"
                              );
                              setCouponForm({ ...couponForm, discountValue: 100000 });
                            } else if (value < 0) {
                              setCouponForm({ ...couponForm, discountValue: 0 });
                            }
                          }
                        }}
                        className="text-sm shadow-sm"
                        placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      onClick={() => setShowCouponForm(false)}
                      color="secondary"
                    >
                      취소
                    </Button>
                    <Button type="submit" color="primary">
                      쿠폰 생성
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
