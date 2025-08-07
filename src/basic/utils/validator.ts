// utils/validator.ts에 추가
export const validatePrice = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseInt(value) : value;

  if (isNaN(numValue)) {
    return { value: 0, error: '숫자만 입력해주세요' };
  }
  if (numValue < 0) {
    return { value: 0, error: '가격은 0보다 커야 합니다' };
  }
  return { value: numValue, error: null };
};

export const validateStock = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseInt(value) : value;

  if (isNaN(numValue)) {
    return { value: 0, error: '숫자만 입력해주세요' };
  }
  if (numValue < 0) {
    return { value: 0, error: '재고는 0 이상이어야 합니다' };
  }
  return { value: numValue, error: null };
};

export const validateRequired = (value: string, fieldName: string) => {
  if (!value.trim()) {
    return { value: value, error: `${fieldName}은(는) 필수입니다` };
  }
  return { value: value, error: null };
};
