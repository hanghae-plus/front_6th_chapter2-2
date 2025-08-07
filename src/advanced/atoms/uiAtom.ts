import { atomWithStorage } from "jotai/utils";

// 관리자 모드 토글
export const isAdminAtom = atomWithStorage<boolean>("isAdmin", false);

// 검색어 관리
export const searchTermAtom = atomWithStorage<string>("searchTerm", "");
