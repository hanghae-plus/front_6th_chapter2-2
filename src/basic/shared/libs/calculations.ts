/**
 * 배열 항목들의 합계 계산
 */
export const sumBy = <T>(items: T[], selector: (item: T) => number): number => {
  return items.reduce((sum, item) => sum + selector(item), 0);
};
