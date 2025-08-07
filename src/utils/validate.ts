export const validateForm = (newValue: string, currentValue: number) => {
  if (newValue === '' || /^\d+$/.test(newValue)) {
    return newValue === '' ? 0 : parseInt(newValue);
  }
  return currentValue; // 유효하지 않은 입력은 이전 값 유지
};
