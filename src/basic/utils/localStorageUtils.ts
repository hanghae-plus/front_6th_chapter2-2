/** localStorage에서 데이터 로드 */
export const loadDataFromStorage = <T>(key: string, initialData: T): T => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return initialData;
    }
  }
  return initialData;
};

/** localStorage에 데이터 저장 */
export const saveDataToStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/** localStorage에서 데이터 삭제 */
export const removeDataFromStorage = (key: string) => {
  localStorage.removeItem(key);
};
