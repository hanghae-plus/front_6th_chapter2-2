// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useAtom, type PrimitiveAtom } from 'jotai';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

interface UseLocalStorageParams<T> {
  key: string;
  initialValue: T;
}

type UseLocalStorageReturn<T> = [T, Dispatch<SetStateAction<T>>];

export function useLocalStorage<T>({
  initialValue,
  key,
}: UseLocalStorageParams<T>): UseLocalStorageReturn<T> {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

interface UseAtomWithLocalStorageParams<T> {
  key: string;
  initialValue: T;
  atom: PrimitiveAtom<T>;
}

export function useAtomWithLocalStorage<T>({
  key,
  initialValue,
  atom,
}: UseAtomWithLocalStorageParams<T>): ReturnType<
  typeof useAtom<T, [SetStateAction<T>], void>
> {
  const [value, setValue] = useAtom(atom);
  const initialValueRef = useRef(initialValue);

  useLayoutEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setValue(JSON.parse(saved));
      } catch {
        setValue(initialValueRef.current);
      }
    }
  }, [key, setValue]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
