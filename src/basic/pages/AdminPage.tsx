import { useCallback, useState } from "react";
import { CloseIcon, PlusIcon } from "../components/icon";
import { ICoupon, IProductWithUI } from "../type";
import { formatPrice } from "../utils/formatters";
import CouponItem from "../components/CouponItem";

interface AdminPageProps {
  // products
  products: IProductWithUI[];
  addProduct: (newProduct: Omit<IProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<IProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  getRemainingStock: (product: IProductWithUI) => number;

  // coupons
  coupons: ICoupon[];
  addCoupon: (newCoupon: ICoupon) => void;
  removeCoupon: (couponCode: string) => void;
  selectedCoupon: ICoupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<ICoupon | null>>;

  // notification
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

const AdminPage = ({
  products,
  getRemainingStock,
  coupons,
  addNotification,
  addProduct,
  updateProduct,
  deleteProduct,
  addCoupon,
  removeCoupon,
  selectedCoupon,
  setSelectedCoupon,
}: AdminPageProps) => {
  // 관리자 페이지 - 활성화된 탭 (상품/쿠폰 관리)
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  // 상품 추가 (수정) 폼 표시
  const [showProductForm, setShowProductForm] = useState(false);
  // 쿠폰 추가 (수정) 폼 표시
  const [showCouponForm, setShowCouponForm] = useState(false);

  // Admin
  // 작성 중인 상품의 상태 - new(추가)이거나 상품의 id(수정)
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  // 현재 작성 중인 상품 정보
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  // 현재 작성 중인 쿠폰 정보
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  // 상품 처리 --------------------

  // 상품 추가
  const addProductItem = useCallback(
    (newProduct: Omit<IProductWithUI, "id">) => {
      const product: IProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`, // 상품 고유 아이디
      };
      addProduct(product);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 수정
  const updateProductItem = useCallback(
    (productId: string, updates: Partial<IProductWithUI>) => {
      updateProduct(productId, updates);
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 삭제
  const deleteProductItem = useCallback(
    (productId: string) => {
      deleteProduct(productId);
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 수정을 위한 함수
  const startEditProduct = (product: IProductWithUI) => {
    // 수정하려는 상품의 아이디 처리
    setEditingProduct(product.id);
    // 상품 폼에 수정하려는 상품 값 채움
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    // 상품 작성 폼 표시
    setShowProductForm(true);
  };

  // 상품 추가 (수정) 처리 submit 함수
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      // 상품 수정 처리
      updateProductItem(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      // 상품 추가 처리
      addProductItem({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    // 작성하던 상품 폼 값 지움
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    // 수정 완료 처리
    setEditingProduct(null);
    // 상품 작성 폼 숨기기
    setShowProductForm(false);
  };

  // 쿠폰 처리 --------------------

  // 쿠폰 추가
  const addCouponItem = useCallback(
    (newCoupon: ICoupon) => {
      // 이미 존재하는 쿠폰인지 코드로 확인
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      addCoupon(newCoupon);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  // 쿠폰 삭제
  const deleteCouponItem = useCallback(
    (couponCode: string) => {
      removeCoupon(couponCode);
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification]
  );

  // 쿠폰 추가 처리 submit 함수
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCouponItem(couponForm);
    // 작성하던 쿠폰 폼 값 지움
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    // 쿠폰 작성 폼 숨기기
    setShowCouponForm(false);
  };

  // 가격 텍스트 처리
  const getPriceText = (item: IProductWithUI) => {
    if (item && getRemainingStock(item) <= 0) return "SOLD OUT";
    return formatPrice(item.price, "won");
  };

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
                {(activeTab === "products" ? products : products).map(
                  (product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getPriceText(product)}
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
                          onClick={() => deleteProductItem(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          {showProductForm && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {/* 상품 생성 폼 */}
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
                        // 숫자만 처리
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
                        // 숫자만 처리
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
                          {/* 상품 추가 - x 아이콘 */}
                          <CloseIcon />
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
                // 쿠폰 컴포넌트
                <CouponItem coupon={coupon} deleteCoupon={deleteCouponItem} />
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  {/* 새 쿠폰 추가 + 아이콘 */}
                  <PlusIcon />
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {showCouponForm && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                {/* 쿠폰 생성 폼 */}
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

export default AdminPage;
