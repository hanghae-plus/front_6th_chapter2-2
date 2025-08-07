import { atom } from "jotai";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const TIMEOUT = 3000 as const;

// 알림 목록 상태 atom
export const notificationsAtom = atom<Notification[]>([]);

// 알림 추가하는 atom
export const addNotificationAtom = atom(
  null,
  (get, set, { message, type = "success" }: { message: string; type?: "error" | "success" | "warning" }) => {
    const id = Math.random().toString(36).substring(2, 15);
    const newNotification = { id, message, type };

    set(notificationsAtom, (prev) => [...prev, newNotification]);

    // 자동 제거 타이머
    setTimeout(() => {
      set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
    }, TIMEOUT);
  }
);

// 알림 제거하는 atom
export const removeNotificationAtom = atom(null, (get, set, id: string) => {
  set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
});
