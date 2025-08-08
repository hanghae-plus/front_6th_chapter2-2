export const sumMap = <T>(array: T[], callback: (value: T) => number) => {
  return array.reduce((sum, value) => sum + callback(value), 0);
};
