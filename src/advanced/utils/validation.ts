/**
 * 특정 값이 "비어 있음(empty)"을 의미하는지 판단합니다.
 *
 * @param value - 검사할 값 (null, undefined, 배열, 객체)
 * @returns 값이 null, undefined, 빈 배열([]), 혹은 빈 객체({})이면 true, 그 외는 false
 *
 * @example
 * isEmptyValue(null); // true
 * isEmptyValue([]); // true
 * isEmptyValue({}); // true
 * isEmptyValue([1, 2]); // false
 */
export const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }

  return false;
};
