import { useState, useEffect } from 'react';

/**
 * localStorage와 연동된 상태를 관리하는 커스텀 훅
 * @param key localStorage 키
 * @param defaultValue 기본값
 * @returns [상태값, 상태변경함수]
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // 초기값 설정 - localStorage에서 복원
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn(`localStorage에서 ${key} 읽기 실패:`, error);
    }
    return defaultValue;
  });

  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      if (key === 'cart' && Array.isArray(state) && state.length === 0) {
        // 장바구니가 비어있으면 localStorage에서 제거
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.warn(`localStorage에 ${key} 저장 실패:`, error);
    }
  }, [key, state]);

  return [state, setState];
}
