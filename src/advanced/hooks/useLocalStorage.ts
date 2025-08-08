import { useState, useEffect } from "react";
import { getStorageItem, setStorageItem } from "../utils/storage";

/**
 * React 상태(state)와 localStorage를 동기화하는 커스텀 훅입니다.
 * 초기 상태는 localStorage의 값을 우선으로 하며, 이후 상태가 변경될 때마다 저장됩니다.
 *
 * @param key - localStorage 키
 * @param initialValue - 초기값 (localStorage에 값이 없거나 오류 발생 시 사용됨)
 * @returns [value, setValue] 튜플 형태의 상태와 상태 변경 함수
 *
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * setTheme('dark'); // localStorage에도 자동 반영됨
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() =>
    getStorageItem(key, initialValue)
  );

  useEffect(() => setStorageItem(key, value), [key, value]);

  return [value, setValue];
};
