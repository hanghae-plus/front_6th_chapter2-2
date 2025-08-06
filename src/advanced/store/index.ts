import { atom } from "jotai";

// 관리자 모드 상태 atom
export const isAdminAtom = atom(false);

// 검색어 상태 atom
export const searchTermAtom = atom("");

// ID 생성 함수
export const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 관리자 모드 토글 액션
export const toggleAdminAtom = atom(null, (get, set) => {
  const isAdmin = get(isAdminAtom);
  set(isAdminAtom, !isAdmin);
});

// 검색어 설정 액션
export const setSearchTermAtom = atom(null, (get, set, term: string) => {
  set(searchTermAtom, term);
});
