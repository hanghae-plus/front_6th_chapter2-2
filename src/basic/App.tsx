import { useState, useCallback } from "react";
import { useProducts, ProductWithUI } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useNotification } from "./hooks/useNotification";
import { useSearch } from "./utils/hooks/useSearch";
import { formatPrice } from "./utils/formatters";
import { calculateFinalTotal } from "./utils/calculations";
import { CartContainer } from "./components/cart/CartContainer";
import { Header } from "./components/ui/header/Header";
import { Notification } from "./components/ui/notification/Notification";

const App = () => {
  // 커스텀 훅 사용
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const {
    cart,
    totalItemCount,
    getRemainingStock,
    calculateItemTotal,
    calculateCartTotal,
    addToCart: addToCartHook,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { coupons, selectedCoupon, addCoupon, deleteCoupon, applyCoupon, setSelectedCoupon } = useCoupons();
  const { notifications, addNotification, removeNotification } = useNotification();

  // 검색 기능
  const { searchTerm, setSearchTerm, filteredProducts, searchInfo } = useSearch(products);

  // 로컬 UI 상태
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");
  const [showProductForm, setShowProductForm] = useState(false);

  // Admin
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const formatPriceWithAdmin = (price: number, productId?: string): string => {
    return formatPrice(price, productId, products, cart, isAdmin);
  };

  // 쿠폰 적용된 총합 계산
  const getFinalTotal = (): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    const cartTotals = calculateCartTotal();
    return calculateFinalTotal(cartTotals, selectedCoupon);
  };

  // 장바구니에 상품 추가 (에러 처리 포함)
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      try {
        addToCartHook(product);
        addNotification("장바구니에 담았습니다", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [addToCartHook, addNotification]
  );

  // 수량 업데이트 (에러 처리 포함)
  const handleUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      try {
        updateQuantity(productId, newQuantity, products);
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [updateQuantity, products, addNotification]
  );

  // 쿠폰 적용 (에러 처리 포함)
  const handleApplyCoupon = useCallback(
    (coupon: any) => {
      try {
        const currentTotal = calculateCartTotal().totalAfterDiscount;
        applyCoupon(coupon, currentTotal);
        addNotification("쿠폰이 적용되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [applyCoupon, calculateCartTotal, addNotification]
  );

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart, setSelectedCoupon]);

  // 상품 추가 (에러 처리 포함)
  const handleAddProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      try {
        addProduct(newProduct);
        addNotification("상품이 추가되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [addProduct, addNotification]
  );

  // 상품 수정 (에러 처리 포함)
  const handleUpdateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      try {
        updateProduct(productId, updates);
        addNotification("상품이 수정되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [updateProduct, addNotification]
  );

  // 상품 삭제 (에러 처리 포함)
  const handleDeleteProduct = useCallback(
    (productId: string) => {
      try {
        deleteProduct(productId);
        addNotification("상품이 삭제되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [deleteProduct, addNotification]
  );

  // 쿠폰 추가 (에러 처리 포함)
  const handleAddCoupon = useCallback(
    (newCoupon: any) => {
      try {
        addCoupon(newCoupon);
        addNotification("쿠폰이 추가되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [addCoupon, addNotification]
  );

  // 쿠폰 삭제 (에러 처리 포함)
  const handleDeleteCoupon = useCallback(
    (couponCode: string) => {
      try {
        deleteCoupon(couponCode);
        addNotification("쿠폰이 삭제되었습니다.", "success");
      } catch (error) {
        addNotification(error instanceof Error ? error.message : "오류가 발생했습니다", "error");
      }
    },
    [deleteCoupon, addNotification]
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      handleUpdateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      handleAddProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const totals = getFinalTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification notifications={notifications} onRemove={removeNotification} />

      <Header
        isAdmin={isAdmin}
        searchTerm={searchTerm}
        totalItemCount={totalItemCount}
        cartItemCount={cart.length}
        onSearchChange={setSearchTerm}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
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
                        setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] });
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
                      {(activeTab === "products" ? products : products).map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPriceWithAdmin(product.price, product.id)}
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
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">상품명</label>
                          <input
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                          <input
                            type="text"
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
                          <input
                            type="text"
                            value={productForm.price === 0 ? "" : productForm.price}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d+$/.test(value)) {
                                setProductForm({ ...productForm, price: value === "" ? 0 : parseInt(value) });
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
                          <input
                            type="text"
                            value={productForm.stock === 0 ? "" : productForm.stock}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d+$/.test(value)) {
                                setProductForm({ ...productForm, stock: value === "" ? 0 : parseInt(value) });
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
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
                            placeholder="숫자만 입력"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">할인 정책</label>
                        <div className="space-y-2">
                          {productForm.discounts.map((discount, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                              <input
                                type="number"
                                value={discount.quantity}
                                onChange={(e) => {
                                  const newDiscounts = [...productForm.discounts];
                                  newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                                  setProductForm({ ...productForm, discounts: newDiscounts });
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
                                  newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                                  setProductForm({ ...productForm, discounts: newDiscounts });
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
                                  const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
                                  setProductForm({ ...productForm, discounts: newDiscounts });
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
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
                            setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] });
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
                            <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                            <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
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
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                      </button>
                    </div>
                  </div>

                  {showCouponForm && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <form onSubmit={handleCouponSubmit} className="space-y-4">
                        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰명</label>
                            <input
                              type="text"
                              value={couponForm.name}
                              onChange={(e) => setCouponForm({ ...couponForm, name: e.target.value })}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                              placeholder="신규 가입 쿠폰"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰 코드</label>
                            <input
                              type="text"
                              value={couponForm.code}
                              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
                              placeholder="WELCOME2024"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">할인 타입</label>
                            <select
                              value={couponForm.discountType}
                              onChange={(e) =>
                                setCouponForm({
                                  ...couponForm,
                                  discountType: e.target.value as "amount" | "percentage",
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
                              {couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
                            </label>
                            <input
                              type="text"
                              value={couponForm.discountValue === 0 ? "" : couponForm.discountValue}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || /^\d+$/.test(value)) {
                                  setCouponForm({ ...couponForm, discountValue: value === "" ? 0 : parseInt(value) });
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
                                    addNotification("할인 금액은 100,000원을 초과할 수 없습니다", "error");
                                    setCouponForm({ ...couponForm, discountValue: 100000 });
                                  } else if (value < 0) {
                                    setCouponForm({ ...couponForm, discountValue: 0 });
                                  }
                                }
                              }}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
                              placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* 상품 목록 */}
              <section>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
                  <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {searchInfo.isSearching
                        ? `"${searchInfo.searchTerm}"에 대한 검색 결과가 없습니다.`
                        : "상품이 없습니다."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => {
                      const remainingStock = getRemainingStock(product);

                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          {/* 상품 이미지 영역 (placeholder) */}
                          <div className="relative">
                            <div className="aspect-square bg-gray-100 flex items-center justify-center">
                              <svg
                                className="w-24 h-24 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            {product.isRecommended && (
                              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                BEST
                              </span>
                            )}
                            {product.discounts.length > 0 && (
                              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                ~{Math.max(...product.discounts.map((d) => d.rate)) * 100}%
                              </span>
                            )}
                          </div>

                          {/* 상품 정보 */}
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                            {product.description && (
                              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                            )}

                            {/* 가격 정보 */}
                            <div className="mb-3">
                              <p className="text-lg font-bold text-gray-900">
                                {formatPriceWithAdmin(product.price, product.id)}
                              </p>
                              {product.discounts.length > 0 && (
                                <p className="text-xs text-gray-500">
                                  {product.discounts[0].quantity}개 이상 구매시 할인 {product.discounts[0].rate * 100}%
                                </p>
                              )}
                            </div>

                            {/* 재고 상태 */}
                            <div className="mb-3">
                              {remainingStock <= 5 && remainingStock > 0 && (
                                <p className="text-xs text-red-600 font-medium">품절임박! {remainingStock}개 남음</p>
                              )}
                              {remainingStock > 5 && <p className="text-xs text-gray-500">재고 {remainingStock}개</p>}
                            </div>

                            {/* 장바구니 버튼 */}
                            <button
                              onClick={() => addToCart(product)}
                              disabled={remainingStock <= 0}
                              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                                remainingStock <= 0
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-900 text-white hover:bg-gray-800"
                              }`}
                            >
                              {remainingStock <= 0 ? "품절" : "장바구니 담기"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartContainer
                  cart={cart}
                  coupons={coupons}
                  selectedCoupon={selectedCoupon}
                  totalBeforeDiscount={totals.totalBeforeDiscount}
                  totalAfterDiscount={totals.totalAfterDiscount}
                  calculateItemTotal={calculateItemTotal}
                  onRemoveFromCart={removeFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={() => setSelectedCoupon(null)}
                  onCompleteOrder={completeOrder}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
