import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, Coupon, ProductWithUI } from "../types";

// ================================
// 초기 데이터
// ================================
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

// ================================
// 타입 정의 - export 추가 ✅
// ================================
export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

// ================================
// UI 상태 atoms
// ================================
export const isAdminAtom = atom<boolean>(false);
export const activeTabAtom = atom<"products" | "coupons">("products");
export const searchTermAtom = atom<string>("");

let debounceTimer: number | null = null;

export const debouncedSearchTermAtom = atom(
  "", // 초기값
  (get, set, newSearchTerm: string) => {
    // 즉시 검색어 업데이트
    set(searchTermAtom, newSearchTerm);

    // 기존 타이머 클리어
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // 새 타이머 설정
    debounceTimer = setTimeout(() => {
      set(debouncedSearchTermAtom, newSearchTerm);
    }, 500);
  }
);

// ================================
// 상품 관련 atoms
// ================================
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);

// 필터된 상품 목록 (derived atom)
export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const searchTerm = get(debouncedSearchTermAtom);

  if (!searchTerm.trim()) return products;

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
});

// ================================
// 장바구니 관련 atoms
// ================================
export const cartItemsAtom = atomWithStorage<CartItem[]>("cart", []);

// 총 아이템 개수 (derived atom)
export const totalItemCountAtom = atom((get) => {
  const cartItems = get(cartItemsAtom);
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
});

// ================================
// 쿠폰 관련 atoms
// ================================
export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
export const selectedCouponAtom = atom<Coupon | null>(null);
// ================================
// 알림 관련 atoms
// ================================
export const notificationsAtom = atom<Notification[]>([]);

// 알림 추가 액션 atom
export const addNotificationAtom = atom(
  null,
  (
    get,
    set,
    {
      message,
      type = "success",
    }: { message: string; type?: "error" | "success" | "warning" }
  ) => {
    const notifications = get(notificationsAtom);
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
    };
    set(notificationsAtom, [...notifications, newNotification]);

    // 3초 후 자동 제거
    setTimeout(() => {
      const currentNotifications = get(notificationsAtom);
      set(
        notificationsAtom,
        currentNotifications.filter((n) => n.id !== newNotification.id)
      );
    }, 3000);
  }
);

// 알림 제거 액션 atom
export const removeNotificationAtom = atom(null, (get, set, id: string) => {
  const notifications = get(notificationsAtom);
  set(
    notificationsAtom,
    notifications.filter((n) => n.id !== id)
  );
});

export const formatPriceAtom = atom((get) => {
  const products = get(productsAtom);
  const cartItems = get(cartItemsAtom);
  const isAdmin = get(isAdminAtom);

  const getRemainingStock = (productId: string): number => {
    const product = products.find((p) => p.id === productId);
    if (!product) return 0;

    const cartItem = cartItems.find((item) => item.product.id === productId);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    return Math.max(0, product.stock - cartQuantity);
  };

  return (price: number, productId?: string): string => {
    if (productId && products && getRemainingStock) {
      const product = products.find((p) => p.id === productId);
      if (product && getRemainingStock(product.id) <= 0) {
        return "SOLD OUT";
      }
    }

    // 관리자/일반 사용자 포맷 구분
    if (isAdmin) {
      return `${price.toLocaleString()}원`;
    }

    return `₩${price.toLocaleString()}`;
  };
});
