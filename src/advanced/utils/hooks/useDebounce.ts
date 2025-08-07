// TODO: 디바운스 Hook
// 힌트:
// 1. 값이 변경되어도 지정된 시간 동안 대기
// 2. 대기 시간 동안 값이 다시 변경되면 타이머 리셋
// 3. 최종적으로 안정된 값만 반환
//
// 사용 예시: 검색어 입력 디바운싱

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 지정된 지연 시간 후에 값 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 값이 변경되면 이전 타이머를 정리하고 새 타이머 설정
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
