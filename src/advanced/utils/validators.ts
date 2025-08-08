export const isNumericInput = (value: string): boolean => {
  return value === "" || /^\d+$/.test(value);
};
