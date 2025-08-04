import { useState, useCallback, useEffect } from "react";
import {
  ICartItem,
  ICoupon,
  IProduct,
  IProductWithUI,
  INotification,
} from "./type";
import {
  CloseIcon,
  LargeBagIcon,
  PlusIcon,
  SmallBagIcon,
} from "./components/icon";
import Header from "./components/Header";
import NotificationItem from "./components/NotificationItem";
import CouponItem from "./components/CouponItem";
import ProductItem from "./components/ProductItem";
import CartItem from "./components/CartItem";

// 초기 데이터
const initialProducts: IProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];

const initialCoupons: ICoupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const App = () => {
  // 로컬 스토리지로 초기 상태 가져오기
  const [products, setProducts] = useState<IProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const [cart, setCart] = useState<ICartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [coupons, setCoupons] = useState<ICoupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  // 쿠폰 할인 - 현재 선택된 쿠폰
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
  // 관리자 페이지 여부
  const [isAdmin, setIsAdmin] = useState(false);
  // 토스트 모달 알람 배열
  const [notifications, setNotifications] = useState<INotification[]>([]);
  // 관리자 페이지 - 활성화된 탭 (상품/쿠폰 관리)
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  // 상품 추가 (수정) 폼 표시
  const [showProductForm, setShowProductForm] = useState(false);
  // 쿠폰 추가 (수정) 폼 표시
  const [showCouponForm, setShowCouponForm] = useState(false);
  // 검색창 내 검색어
  const [searchTerm, setSearchTerm] = useState("");
  // 상품 검색어 - 자동으로 검색 반영되며 상품 페이지에 보여지는 값
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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

  // 가격 표시 함수
  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        // 재고가 없으면 SOLD OUT 표시
        return "SOLD OUT";
      }
    }

    // 관리자 페이지에선 원, 상품 페이지에선 ₩로 가격 표시
    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  // 최대 할인율 계산 ** cartModel
  const getMaxApplicableDiscount = (item: ICartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    // 기본 할인율 계산
    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    // 10개 이상 구매하는 상품이 있는지 확인 (대량 구매)
    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인 (최대 할인율 - 50%)
    }

    return baseDiscount;
  };

  // 최종 할인율이 반영된 상품 가격 ** cartModel
  const calculateItemTotal = (item: ICartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  // 할인 전, 할인 후 가격 반환 ** cartModel
  const calculateCartTotal = (): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice; // 아이템의 기본 가격
      totalAfterDiscount += calculateItemTotal(item); // 최종 할인된 아이템 가격
    });

    // 선택된 쿠폰이 있으면 쿠폰 적용
    if (selectedCoupon) {
      if (selectedCoupon.discountType === "amount") {
        totalAfterDiscount = Math.max(
          0,
          totalAfterDiscount - selectedCoupon.discountValue
        );
      } else {
        totalAfterDiscount = Math.round(
          totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
        );
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  };

  // 재고 확인 함수 ** cartModel
  const getRemainingStock = (product: IProduct): number => {
    // 상품 재고 수 - 카트에 담긴 상품 수
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  };

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      // 알림 구분을 위한 고유 식별자
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      // 3초 후 해당 알림 제거
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  // 장바구니 내 전체 상품 수
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // 상품과 쿠폰 상태를 로컬 스토리지와 동기화
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  // 장바구니가 비면 로컬 스토리지 키 자체를 삭제
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // 검색창 내 검색어가 바뀔 때 5초마다 바로 검색 반영
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 장바구니 담기 버튼 처리 ** cartModel
  const addToCart = useCallback(
    (product: IProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        // 이미 장바구니에 존재하는 상품 처리
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              "error"
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        // 장바구니에 없는 상품이면 추가
        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification, getRemainingStock]
  );

  // 장바구니에서 상품 제거 ** cartModel
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

  // 장바구니의 상품 수 업데이트 (-1, +1 처리) ** cartModel
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, addNotification, getRemainingStock]
  );

  // 쿠폰 적용 함수
  const applyCoupon = useCallback(
    (coupon: ICoupon) => {
      // 할인 적용 전 총 가격
      const currentTotal = calculateCartTotal().totalAfterDiscount;

      // 총 가격 10000원 이하일 경우 처리
      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      // 쿠폰 적용 후 알림 처리
      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, calculateCartTotal]
  );

  // 주문 완료 처리 함수
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  // 상품 추가 ** productModel
  const addProduct = useCallback(
    (newProduct: Omit<IProductWithUI, "id">) => {
      const product: IProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`, // 상품 고유 아이디
      };
      setProducts((prev) => [...prev, product]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 수정 ** productModel
  const updateProduct = useCallback(
    (productId: string, updates: Partial<IProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );

  // 상품 삭제 **    odel
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  // 쿠폰 추가 ** couponModel
  const addCoupon = useCallback(
    (newCoupon: ICoupon) => {
      // 이미 존재하는 쿠폰인지 코드로 확인
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );

  // 쿠폰 삭제 ** couponModel
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [selectedCoupon, addNotification]
  );

  // 상품 추가 (수정) 처리 submit 함수
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      // 상품 수정 처리
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      // 상품 추가 처리
      addProduct({
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

  // 쿠폰 추가 처리 submit 함수
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
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

  // 할인 전 가격, 할인 후 가격
  const totals = calculateCartTotal();

  // 검색어 반영된 상품 목록
  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 알림 표시 컨테이너 */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            // 토스트 모달 컴포넌트
            <NotificationItem
              notification={notif}
              setNotifications={setNotifications}
            />
          ))}
        </div>
      )}

      {/* 헤더 */}
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          // 관리자 페이지
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                관리자 대시보드
              </h1>
              <p className="text-gray-600 mt-1">
                상품과 쿠폰을 관리할 수 있습니다
              </p>
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
                        {editingProduct === "new"
                          ? "새 상품 추가"
                          : "상품 수정"}
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
                            value={
                              productForm.price === 0 ? "" : productForm.price
                            }
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
                                addNotification(
                                  "가격은 0보다 커야 합니다",
                                  "error"
                                );
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
                            value={
                              productForm.stock === 0 ? "" : productForm.stock
                            }
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
                                addNotification(
                                  "재고는 0보다 커야 합니다",
                                  "error"
                                );
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
                                  const newDiscounts = [
                                    ...productForm.discounts,
                                  ];
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
                                  const newDiscounts = [
                                    ...productForm.discounts,
                                  ];
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
                                  const newDiscounts =
                                    productForm.discounts.filter(
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
                      <CouponItem coupon={coupon} deleteCoupon={deleteCoupon} />
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
                                    discountValue:
                                      value === "" ? 0 : parseInt(value),
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
                                couponForm.discountType === "amount"
                                  ? "5000"
                                  : "10"
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
        ) : (
          // 상품 목록 페이지
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* 상품 목록 */}
              <section>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    전체 상품
                  </h2>
                  <div className="text-sm text-gray-600">
                    총 {products.length}개 상품
                  </div>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => {
                      const remainingStock = getRemainingStock(product);

                      return (
                        // 상품 컴포넌트
                        <ProductItem
                          product={product}
                          remainingStock={remainingStock}
                          priceText={formatPrice(product.price, product.id)}
                          addToCart={addToCart}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* 장바구니 + 결제 정보 컨테이너 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    {/* 장바구니 아이콘 */}
                    <SmallBagIcon />
                    장바구니
                  </h2>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      {/* 장바구니 큰 아이콘 */}
                      <LargeBagIcon />
                      <p className="text-gray-500 text-sm">
                        장바구니가 비어있습니다
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => {
                        return (
                          // 카트 상품 컴포넌트
                          <CartItem
                            item={item}
                            calculateItemTotal={calculateItemTotal}
                            removeFromCart={removeFromCart}
                            updateQuantity={updateQuantity}
                          />
                        );
                      })}
                    </div>
                  )}
                </section>

                {cart.length > 0 && (
                  <>
                    <section className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                          쿠폰 할인
                        </h3>
                        <button className="text-xs text-blue-600 hover:underline">
                          쿠폰 등록
                        </button>
                      </div>
                      {coupons.length > 0 && (
                        <select
                          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                          value={selectedCoupon?.code || ""}
                          onChange={(e) => {
                            const coupon = coupons.find(
                              (c) => c.code === e.target.value
                            );
                            if (coupon) applyCoupon(coupon);
                            else setSelectedCoupon(null);
                          }}
                        >
                          <option value="">쿠폰 선택</option>
                          {coupons.map((coupon) => (
                            <option key={coupon.code} value={coupon.code}>
                              {coupon.name} (
                              {coupon.discountType === "amount"
                                ? `${coupon.discountValue.toLocaleString()}원`
                                : `${coupon.discountValue}%`}
                              )
                            </option>
                          ))}
                        </select>
                      )}
                    </section>

                    <section className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">상품 금액</span>
                          <span className="font-medium">
                            {totals.totalBeforeDiscount.toLocaleString()}원
                          </span>
                        </div>
                        {totals.totalBeforeDiscount -
                          totals.totalAfterDiscount >
                          0 && (
                          <div className="flex justify-between text-red-500">
                            <span>할인 금액</span>
                            <span>
                              -
                              {(
                                totals.totalBeforeDiscount -
                                totals.totalAfterDiscount
                              ).toLocaleString()}
                              원
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-t border-gray-200">
                          <span className="font-semibold">결제 예정 금액</span>
                          <span className="font-bold text-lg text-gray-900">
                            {totals.totalAfterDiscount.toLocaleString()}원
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={completeOrder}
                        className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                      >
                        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                      </button>

                      <div className="mt-3 text-xs text-gray-500 text-center">
                        <p>* 실제 결제는 이루어지지 않습니다</p>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
