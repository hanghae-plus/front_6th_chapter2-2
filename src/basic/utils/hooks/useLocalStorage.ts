// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  // TODO: 구현
  const [localValue, setLocalValue] = useState<T>(() => {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return initialValue
      }
    }
    return initialValue
  })

  const saveLocalStorage = (val: T | ((val: T) => T)) => {
    // 타입 가드로 확실하게 구분
    const isUpdater = (val: T | ((prev: T) => T)): val is (prev: T) => T => {
      return typeof val === 'function'
    }
    if (isUpdater(val)) {
      // 함수형 업데이트: 함수를 실행한 결과를 localStorage에 저장
      setLocalValue((prev) => {
        const result = val(prev)
        if (result === null || result === undefined) {
          localStorage.removeItem(key)
          return initialValue
        } else {
          localStorage.setItem(key, JSON.stringify(result))
          return result
        }
      })
    } else if (
      [null, undefined].includes(val as never) ||
      (Array.isArray(val) && val.length === 0)
    ) {
      setLocalValue(initialValue)
      localStorage.removeItem(key)
    } else {
      // 직접 값: 값을 그대로 localStorage에 저장
      setLocalValue(val)
      localStorage.setItem(key, JSON.stringify(val))
    }
  }

  return [localValue, saveLocalStorage]
}
