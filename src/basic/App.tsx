import { useState, useCallback, useEffect } from "react";
import { CartItem, Coupon, Product } from "../types";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import {
  CartIcon,
  ShoppingBagIcon,
  XIcon,
  TrashIcon,
  PlusIcon,
} from "./components/icons";
import ProductList from "./components/product/ProductList";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

// 초기 데이터
const initialProducts: ProductWithUI[] = [
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

const initialCoupons: Coupon[] = [
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
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
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

  const [cart, setCart] = useState<CartItem[]>(() => {
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

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
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

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product) <= 0) {
        return "SOLD OUT";
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };

  const getMaxApplicableDiscount = (item: CartItem): number => {
    const { discounts } = item.product;
    const { quantity } = item;

    const baseDiscount = discounts.reduce((maxDiscount, discount) => {
      return quantity >= discount.quantity && discount.rate > maxDiscount
        ? discount.rate
        : maxDiscount;
    }, 0);

    const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
    if (hasBulkPurchase) {
      return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
    }

    return baseDiscount;
  };

  const calculateItemTotal = (item: CartItem): number => {
    const { price } = item.product;
    const { quantity } = item;
    const discount = getMaxApplicableDiscount(item);

    return Math.round(price * quantity * (1 - discount));
  };

  const calculateCartTotal = (): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item);
    });

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

  const getRemainingStock = (product: Product): number => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    return remaining;
  };

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
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

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification, getRemainingStock]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

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

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal().totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, calculateCartTotal]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification]
  );

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
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

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
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

  const totals = calculateCartTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === "error"
                  ? "bg-red-600"
                  : notif.type === "warning"
                  ? "bg-yellow-600"
                  : "bg-green-600"
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <Button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notif.id)
                  )
                }
                variant="ghost"
                size="small"
                className="text-white hover:text-gray-200 p-1 flex items-center justify-center"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="상품 검색..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <Button
                onClick={() => setIsAdmin(!isAdmin)}
                variant={isAdmin ? "black" : "ghost"}
                size="small"
              >
                {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
              </Button>
              {!isAdmin && (
                <CartIcon
                  itemCount={totalItemCount}
                  className="w-6 h-6 text-gray-700"
                />
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
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
                    <Button
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
                      variant="black"
                      size="small"
                    >
                      새 상품 추가
                    </Button>
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
                              <Button
                                onClick={() => startEditProduct(product)}
                                variant="ghost"
                                size="small"
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                수정
                              </Button>
                              <Button
                                onClick={() => deleteProduct(product.id)}
                                variant="ghost"
                                size="small"
                                className="text-red-600 hover:text-red-900"
                              >
                                삭제
                              </Button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                {showProductForm && (
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {editingProduct === "new"
                          ? "새 상품 추가"
                          : "상품 수정"}
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Input
                            label="상품명"
                            type="text"
                            value={productForm.name}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Input
                            label="설명"
                            type="text"
                            value={productForm.description}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Input
                            label="가격"
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
                            placeholder="숫자만 입력"
                            required
                          />
                        </div>
                        <div>
                          <Input
                            label="재고"
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
                              <Input
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
                                className="w-20 px-2 py-1"
                                min="1"
                                placeholder="수량"
                              />
                              <span className="text-sm">개 이상 구매 시</span>
                              <Input
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
                                className="w-16 px-2 py-1"
                                min="0"
                                max="100"
                                placeholder="%"
                              />
                              <span className="text-sm">% 할인</span>
                              <Button
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
                                variant="ghost"
                                size="small"
                                className="text-red-600 hover:text-red-800 p-1 flex items-center justify-center"
                              >
                                <XIcon className="w-4 h-4" />
                              </Button>
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
                        <Button
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
                          variant="outline"
                          size="small"
                        >
                          취소
                        </Button>
                        <Button type="submit" variant="indigo" size="medium">
                          {editingProduct === "new" ? "추가" : "수정"}
                        </Button>
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
                          <Button
                            onClick={() => deleteCoupon(coupon.code)}
                            variant="ghost"
                            size="small"
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 flex items-center justify-center"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                      <Button
                        onClick={() => setShowCouponForm(!showCouponForm)}
                        variant="ghost"
                        className="text-gray-400 hover:text-gray-600 flex flex-col items-center justify-center h-full w-full"
                      >
                        <PlusIcon className="w-8 h-8" />
                        <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                      </Button>
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
                            <Input
                              label="쿠폰명"
                              type="text"
                              value={couponForm.name}
                              onChange={(e) =>
                                setCouponForm({
                                  ...couponForm,
                                  name: e.target.value,
                                })
                              }
                              className="text-sm"
                              placeholder="신규 가입 쿠폰"
                              required
                            />
                          </div>
                          <div>
                            <Input
                              label="쿠폰 코드"
                              type="text"
                              value={couponForm.code}
                              onChange={(e) =>
                                setCouponForm({
                                  ...couponForm,
                                  code: e.target.value.toUpperCase(),
                                })
                              }
                              className="text-sm font-mono"
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
                            <Input
                              label={
                                couponForm.discountType === "amount"
                                  ? "할인 금액"
                                  : "할인율(%)"
                              }
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
                              className="text-sm"
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
                          <Button
                            type="button"
                            onClick={() => setShowCouponForm(false)}
                            variant="outline"
                            size="small"
                          >
                            취소
                          </Button>
                          <Button type="submit" variant="indigo" size="medium">
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
        ) : (
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
                <ProductList
                  cart={cart}
                  products={products}
                  debouncedSearchTerm={debouncedSearchTerm}
                  addToCart={addToCart}
                />
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <ShoppingBagIcon className="w-5 h-5 mr-2" size="small" />
                    장바구니
                  </h2>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBagIcon
                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        size="large"
                      />
                      <p className="text-gray-500 text-sm">
                        장바구니가 비어있습니다
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => {
                        const itemTotal = calculateItemTotal(item);
                        const originalPrice =
                          item.product.price * item.quantity;
                        const hasDiscount = itemTotal < originalPrice;
                        const discountRate = hasDiscount
                          ? Math.round((1 - itemTotal / originalPrice) * 100)
                          : 0;

                        return (
                          <div
                            key={item.product.id}
                            className="border-b pb-3 last:border-b-0"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium text-gray-900 flex-1">
                                {item.product.name}
                              </h4>
                              <Button
                                onClick={() => removeFromCart(item.product.id)}
                                variant="ghost"
                                size="small"
                                className="text-gray-400 hover:text-red-500 ml-2 p-1 flex items-center justify-center"
                              >
                                <XIcon className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <span className="text-xs">−</span>
                                </button>
                                <span className="mx-3 text-sm font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <span className="text-xs">+</span>
                                </button>
                              </div>
                              <div className="text-right">
                                {hasDiscount && (
                                  <span className="text-xs text-red-500 font-medium block">
                                    -{discountRate}%
                                  </span>
                                )}
                                <p className="text-sm font-medium text-gray-900">
                                  {Math.round(itemTotal).toLocaleString()}원
                                </p>
                              </div>
                            </div>
                          </div>
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

                      <Button
                        onClick={completeOrder}
                        variant="yellow"
                        className="w-full mt-4"
                      >
                        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                      </Button>

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
