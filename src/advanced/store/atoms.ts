import { atom } from 'jotai';

// 관리자 모드 상태
export const isAdminAtom = atom(false);

// 검색 관련 상태
export const searchTermAtom = atom('');
export const debouncedSearchTermAtom = atom('');

// 알림 관련 상태
export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

export const notificationsAtom = atom<Notification[]>([]);

// 알림 제거 atom을 먼저 정의
export const removeNotificationAtom = atom(null, (get, set, id: string) => {
  set(notificationsAtom, prev => prev.filter(notification => notification.id !== id));
});

// 알림 추가 atom
export const addNotificationAtom = atom(
  null,
  (get, set, { message, type }: { message: string; type: 'error' | 'success' | 'warning' }) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, message, type };
    set(notificationsAtom, prev => [...prev, newNotification]);
  }
);

// 테스트용 초기화 atom
export const resetAllAtomsAtom = atom(null, (get, set) => {
  set(isAdminAtom, false);
  set(searchTermAtom, '');
  set(debouncedSearchTermAtom, '');
  set(notificationsAtom, []);
});
