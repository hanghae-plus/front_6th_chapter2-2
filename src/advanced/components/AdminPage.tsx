import { useAtom, useAtomValue } from "jotai";
import { TrashIcon, PlusIcon, CloseIcon } from "./icons";

// ✅ Jotai atoms import
import { activeTabAtom, formatPriceAtom } from "../atoms";

// ✅ Jotai hooks import
import { useProducts } from "../hooks/useProducts";
import { useCoupons } from "../hooks/useCoupons";
import { useNotificationJotai } from "../hooks/useNotification";

// ✅ 비즈니스 로직 import
import {
  handlePriceInput,
  handleStockInput,
  validatePrice,
  validateStock,
} from "../models/product";

import {
  handleCouponCodeInput,
  handleDiscountValueInput,
  validateDiscountValue,
  formatCouponDescription,
} from "../models/coupon";

export function AdminPage() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const formatPrice = useAtomValue(formatPriceAtom);

  const notifications = useNotificationJotai();

  const productsHook = useProducts({
    addNotification: notifications.addNotification,
  });

  const couponsHook = useCoupons({
    addNotification: notifications.addNotification,
  });

  const {
    products,
    showProductForm,
    editingProduct,
    productForm,
    onShowProductForm,
    onProductSubmit,
    onProductFormChange,
    onCancelProductForm,
    onStartEditProduct,
    onDeleteProduct,
    onAddDiscount,
    onRemoveDiscount,
  } = productsHook;

  const {
    coupons,
    showCouponForm,
    couponForm,
    onShowCouponForm,
    onCouponSubmit,
    onCouponFormChange,
    onCancelCouponForm,
    onDeleteCoupon,
  } = couponsHook;

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
                onClick={onShowProductForm}
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
                        onClick={() => onStartEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
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
              <form onSubmit={onProductSubmit} className="space-y-4">
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
                        onProductFormChange("name", e.target.value)
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
                        onProductFormChange("description", e.target.value)
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
                        const result = handlePriceInput(e.target.value);
                        if (result.isValid) {
                          onProductFormChange("price", result.price);
                        }
                      }}
                      onBlur={(e) => {
                        const validation = validatePrice(e.target.value);
                        if (!validation.isValid) {
                          notifications.addNotification(
                            validation.errorMessage!,
                            "error"
                          );
                          onProductFormChange(
                            "price",
                            validation.correctedPrice
                          );
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
                        const result = handleStockInput(e.target.value);
                        if (result.isValid) {
                          onProductFormChange("stock", result.stock);
                        } else {
                          notifications.addNotification(
                            result.errorMessage!,
                            "error"
                          );
                        }
                      }}
                      onBlur={(e) => {
                        const validation = validateStock(e.target.value);
                        if (!validation.isValid) {
                          notifications.addNotification(
                            validation.errorMessage!,
                            "error"
                          );
                          onProductFormChange(
                            "stock",
                            validation.correctedStock
                          );
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
                            onProductFormChange("discounts", newDiscounts);
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
                            onProductFormChange("discounts", newDiscounts);
                          }}
                          className="w-16 px-2 py-1 border rounded"
                          min="0"
                          max="100"
                          placeholder="%"
                        />
                        <span className="text-sm">% 할인</span>
                        <button
                          type="button"
                          onClick={() => onRemoveDiscount(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <CloseIcon className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={onAddDiscount}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      + 할인 추가
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onCancelProductForm}
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
                          {/* ✅ coupon 도메인 함수 사용 */}
                          {formatCouponDescription(coupon)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteCoupon(coupon.code)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <button
                  onClick={onShowCouponForm}
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  <PlusIcon className="w-8 h-8 mb-2" strokeWidth={2} />
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {showCouponForm && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <form onSubmit={onCouponSubmit} className="space-y-4">
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
                          onCouponFormChange("name", e.target.value)
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
                        onChange={(e) => {
                          const couponFormat = handleCouponCodeInput(
                            e.target.value
                          );
                          onCouponFormChange("code", couponFormat);
                        }}
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
                          onCouponFormChange("discountType", e.target.value)
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
                          const result = handleDiscountValueInput(
                            e.target.value,
                            couponForm.discountType
                          );
                          if (result.isValid) {
                            onCouponFormChange(
                              "discountValue",
                              result.discountValue
                            );
                          } else {
                            notifications.addNotification(
                              result.errorMessage!,
                              "error"
                            );
                          }
                        }}
                        onBlur={(e) => {
                          const validation = validateDiscountValue(
                            e.target.value,
                            couponForm.discountType
                          );
                          if (!validation.isValid) {
                            notifications.addNotification(
                              validation.errorMessage!,
                              "error"
                            );
                            onCouponFormChange(
                              "discountValue",
                              validation.correctedValue
                            );
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
                      onClick={onCancelCouponForm}
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
}
