export const sumBy = <T>(items: T[], selector: (item: T) => number): number => {
  return items.reduce((sum, item) => sum + selector(item), 0);
};
