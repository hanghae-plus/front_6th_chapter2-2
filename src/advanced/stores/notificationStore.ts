import { atom } from "jotai";

type NotificationType = "error" | "success" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

const TIMEOUT = 3000 as const;

// 알림 목록 상태 atom
export const notificationsAtom = atom<Notification[]>([]);

// 알림 추가하는 atom
export const addNotificationAtom = atom(null, (_, set, { message, type = "success" }: Omit<Notification, "id">) => {
  const id = Math.random().toString(36).substring(2, 15);
  const newNotification = { id, message, type };

  set(notificationsAtom, (prev) => [...prev, newNotification]);

  // 자동 제거 타이머
  setTimeout(() => {
    set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
  }, TIMEOUT);
});

// 알림 제거하는 atom
export const removeNotificationAtom = atom(null, (_, set, id: string) => {
  set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
});

// 관리자 모드 상태 atom
export const isAdminAtom = atom<boolean>(false);

// 관리자 모드 토글 atom
export const toggleAdminAtom = atom(null, (get, set) => {
  const currentIsAdmin = get(isAdminAtom);
  set(isAdminAtom, !currentIsAdmin);
});
