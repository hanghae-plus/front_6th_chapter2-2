import { atom } from "jotai";
import { Notification } from "../types";
import { calculateCartTotal } from "../service/cart";
import { Coupon } from "../../types";
import { cartAtom } from "./cart";
import { productsAtom } from "./product";

// --- Writable Atoms (전역 상태) ---

export const notificationsAtom = atom<Notification[]>([]);
export const isAdminAtom = atom(false);
export const selectedCouponAtom = atom<Coupon | null>(null);
export const searchTermAtom = atom("");

export const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const addNotificationHelper = (
  get: any,
  set: any,
  message: string,
  type: "error" | "success" | "warning" = "success"
) => {
  const notifications = get(notificationsAtom);
  const newNotification: Notification = {
    id: generateId("notification"),
    message,
    type,
    timestamp: new Date(),
  };
  set(notificationsAtom, [...notifications, newNotification]);

  // 3초 후 자동으로 알림 제거
  setTimeout(() => {
    const currentNotifications = get(notificationsAtom);
    const updatedNotifications = currentNotifications.filter(
      (n: Notification) => n.id !== newNotification.id
    );
    set(notificationsAtom, updatedNotifications);
  }, 3000);
};

// --- Action Atoms (액션) ---

// 알림 관련 액션
export const addNotificationAtom = atom(
  null,
  (
    get,
    set,
    message: string,
    type: "error" | "success" | "warning" = "success"
  ) => {
    addNotificationHelper(get, set, message, type);
  }
);

export const removeNotificationAtom = atom(
  null,
  (get, set, notificationId: string) => {
    const notifications = get(notificationsAtom);
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== notificationId
    );
    set(notificationsAtom, updatedNotifications);
  }
);

// 관리자 모드 토글 액션
export const toggleAdminAtom = atom(null, (get, set) => {
  const isAdmin = get(isAdminAtom);
  set(isAdminAtom, !isAdmin);
});

// 검색어 설정 액션
export const setSearchTermAtom = atom(null, (get, set, term: string) => {
  set(searchTermAtom, term);
});

// --- Derived Atoms (파생 상태) ---
export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});

export const totalCartCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.quantity, 0);
});

export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);
  if (!searchTerm) return products;
  const lowercasedTerm = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercasedTerm) ||
      (product.description &&
        product.description.toLowerCase().includes(lowercasedTerm))
  );
});

export const getRemainingStockAtom = atom((get) => (productId: string) => {
  const products = get(productsAtom);
  const cart = get(cartAtom);
  const product = products.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.product.id === productId);
  const stock = product ? product.stock : 0;
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  return stock - quantityInCart;
});
