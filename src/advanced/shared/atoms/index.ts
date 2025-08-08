import { atom } from "jotai";

// UI 상태
export const isAdminAtom = atom(false);
export const searchTermAtom = atom("");
export const debouncedSearchTermAtom = atom("");

// 알림 상태
export const notificationsAtom = atom<any[]>([]);
