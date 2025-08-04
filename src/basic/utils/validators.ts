// src/basic/utils/validators.ts

export const validateNumberInput = (value: string): string => {
  // 숫자 이외의 문자 제거
  const onlyNums = value.replace(/[^0-9]/g, '');
  return onlyNums;
};
