import { useSyncExternalStore, useCallback } from 'react';

// localStorage의 구독자들을 관리하는 Map
const storageListeners = new Map<string, Set<() => void>>();

// localStorage 값 변경을 구독자들에게 알리는 함수
const notifyListeners = (key: string) => {
  const listeners = storageListeners.get(key);
  if (listeners) {
    listeners.forEach(listener => listener());
  }
};

// localStorage에서 값을 안전하게 가져오는 함수
const getStorageValue = <T>(key: string, initialValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
};

// localStorage에 값을 안전하게 저장하는 함수
const setStorageValue = <T>(key: string, value: T): void => {
  try {
    // 빈 배열이나 undefined는 삭제
    if (Array.isArray(value) && value.length === 0) {
      localStorage.removeItem(key);
    } else if (value === undefined || value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }

    // 구독자들에게 변경 알림
    notifyListeners(key);
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

// 특정 키를 구독하는 함수
const subscribeToStorage = (key: string, callback: () => void): (() => void) => {
  // 해당 키의 구독자 Set이 없으면 생성
  if (!storageListeners.has(key)) {
    storageListeners.set(key, new Set());
  }

  // 구독자 추가
  const listeners = storageListeners.get(key)!;
  listeners.add(callback);

  // 구독 해제 함수 반환
  return () => {
    listeners.delete(callback);
    // 구독자가 없으면 Set 제거
    if (listeners.size === 0) {
      storageListeners.delete(key);
    }
  };
};

// 동기화된 localStorage hook
export function useSyncedLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // 현재 스냅샷을 가져오는 함수 - JSON 문자열로 직렬화하여 안정적인 참조 생성
  const getSnapshot = () => {
    const value = getStorageValue(key, initialValue);
    return JSON.stringify(value);
  };

  // 서버 사이드 렌더링용 스냅샷
  const getServerSnapshot = () => {
    return JSON.stringify(initialValue);
  };

  // 구독 함수
  const subscribe = (callback: () => void) => {
    return subscribeToStorage(key, callback);
  };

  // useSyncExternalStore로 외부 스토어 구독 - 문자열로 받아서 다시 파싱
  const serializedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = JSON.parse(serializedValue);

  // 값 설정 함수
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const currentValue = getStorageValue(key, initialValue);
      const valueToStore = typeof newValue === 'function' ? (newValue as (prev: T) => T)(currentValue) : newValue;

      setStorageValue(key, valueToStore);
    },
    [key, initialValue]
  );

  return [value, setValue];
}
