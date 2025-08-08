export const formatErrorMessageProduct = (target: string, price: number) => {
  return `${target}은 ${price}보다 커야 합니다.`;
};

export const formatExceedErrorMessage = (target: string, price: number) => {
  return `${target}은 ${price}를 초과할 수 없습니다.`;
};

export const formatAddMessage = (target: string) => {
  return `${target}이 추가되었습니다.`;
};

export const formatErrorMessageCRUD = (target: string, action: string) => {
  return `${target} ${action} 중 오류가 발생했습니다.`;
};
