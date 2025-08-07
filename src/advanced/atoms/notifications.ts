import { atom } from "jotai";
import { Notification } from "../types";
import { NOTIFICATION_DURATION } from "../constants/system";
import { cartAtom } from "./cart";
import { selectedCouponAtom } from "./coupons";

// 통합된 알림 아톰 (상태 + 액션)
export const notificationsAtom = atom<Notification[]>([]);

// 알림 추가 액션
export const addNotificationAtom = atom(
  null,
  (
    get,
    set,
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    const notifications = get(notificationsAtom);
    const newNotification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
    };

    set(notificationsAtom, [...notifications, newNotification]);

    // 3초 후 자동 제거
    setTimeout(() => {
      const current = get(notificationsAtom);
      set(
        notificationsAtom,
        current.filter((n) => n.id !== newNotification.id)
      );
    }, NOTIFICATION_DURATION);
  }
);

// 알림 제거 액션
export const removeNotificationAtom = atom(
  null,
  (get, set, notificationId: string) => {
    const notifications = get(notificationsAtom);
    set(
      notificationsAtom,
      notifications.filter((n) => n.id !== notificationId)
    );
  }
);

// 주문 완료 액션 (다중 도메인 상태 변경)
export const completeOrderAtom = atom(null, (_, set) => {
  const orderNumber = `ORD-${Date.now()}`;

  // 알림 표시
  set(
    addNotificationAtom,
    `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
    "success"
  );

  // 장바구니 초기화
  set(cartAtom, []);

  // 선택된 쿠폰 초기화
  set(selectedCouponAtom, null);
});
