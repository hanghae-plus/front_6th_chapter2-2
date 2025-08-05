import { isEmptyValue } from "./validation";

/**
 * 주어진 키에 해당하는 값을 localStorage에 JSON 형태로 저장합니다.
 * 값이 null, undefined, 빈 배열, 빈 객체인 경우 해당 키를 제거합니다.
 *
 * @param key - localStorage에 저장할 키
 * @param value - 저장할 값 (JSON 직렬화 가능해야 함)
 *
 * @throws 저장 중 JSON.stringify 에러 또는 localStorage 오류 발생 시 콘솔 경고 출력
 *
 * @example
 * setStorageItem('theme', 'dark');
 * setStorageItem('cart', []); // 빈 배열 → localStorage에서 제거됨
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    if (isEmptyValue(value)) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`Error writing to localStorage[${key}]`, e);
  }
};

/**
 * localStorage에서 주어진 키에 해당하는 값을 읽어 반환합니다.
 * 값이 없거나 JSON 파싱 중 오류가 발생하면 fallback 값을 반환합니다.
 *
 * @param key - 읽을 localStorage 키
 * @param fallback - 값이 없거나 오류 시 반환할 기본값
 * @returns JSON 파싱된 값 또는 fallback
 *
 * @example
 * getStorageItem('theme', 'light'); // 'dark' 또는 'light'
 */
export const getStorageItem = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);

    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage[${key}]`, e);
    return fallback;
  }
};
