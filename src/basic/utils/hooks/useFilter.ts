import { useMemo } from "react";

/**
 * 배열을 필터링하는 범용 훅
 * @param items - 필터링할 배열
 * @param filterFn - 필터링 함수
 * @returns 필터링된 배열과 필터 정보
 */
export const useFilter = <T>(items: T[], filterFn: (item: T) => boolean) => {
  const filteredItems = useMemo(() => {
    return items.filter(filterFn);
  }, [items, filterFn]);

  const filterInfo = {
    totalCount: items.length,
    filteredCount: filteredItems.length,
    isFiltered: filteredItems.length !== items.length,
  };

  return {
    filteredItems,
    filterInfo,
  };
};
