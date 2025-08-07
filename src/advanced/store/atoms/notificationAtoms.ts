import { atom } from "jotai";
import { Notification } from "../../types";

// 알림 상태 atom
export const notificationsAtom = atom<Notification[]>([]);
