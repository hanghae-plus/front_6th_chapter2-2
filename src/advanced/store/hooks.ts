import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import {
  isAdminAtom,
  searchTermAtom,
  debouncedSearchTermAtom,
  notificationsAtom,
  addNotificationAtom,
  removeNotificationAtom,
  resetAllAtomsAtom
} from './atoms';

// 관리자 모드 훅
export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

  const toggleAdmin = () => setIsAdmin(prev => !prev);

  return { isAdmin, setIsAdmin, toggleAdmin };
};

// 검색 훅
export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useAtom(debouncedSearchTermAtom);

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, setDebouncedSearchTerm]);

  return { searchTerm, setSearchTerm, debouncedSearchTerm };
};

// 알림 훅
export const useNotifications = () => {
  const notifications = useAtomValue(notificationsAtom);
  const addNotification = useSetAtom(addNotificationAtom);
  const removeNotification = useSetAtom(removeNotificationAtom);

  return { notifications, addNotification, removeNotification };
};

// 테스트용 초기화 훅
export const useResetStore = () => {
  const resetAllAtoms = useSetAtom(resetAllAtomsAtom);
  return resetAllAtoms;
};
