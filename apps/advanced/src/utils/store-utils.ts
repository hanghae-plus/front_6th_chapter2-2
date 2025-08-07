export const ensureArray = <T>(value: T[] | null | undefined): T[] => {
  return value ?? [];
};
