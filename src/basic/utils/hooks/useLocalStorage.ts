// src/basic/utils/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';
import { Product } from '../../types';

// 데이터 구조를 검증하고 기본값을 채워주는 함수
const validateAndHydrate = (key: string, data: any) => {
  if (key === 'products' && Array.isArray(data)) {
    return data.map((item: Partial<Product>) => ({
      id: item.id || `p${Date.now()}`,
      name: item.name || 'Unnamed Product',
      price: item.price || 0,
      stock: item.stock || 0,
      discounts: item.discounts || [], // discounts가 없으면 빈 배열로 초기화
      description: item.description || '',
    }));
  }
  if (key === 'cart' && Array.isArray(data)) {
    return data.map((item: Partial<Product>) => ({
      ...item,
      discounts: item.discounts || [], // cart item에도 discounts 보장
    }));
  }
  return data;
}


export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      const parsedItem = JSON.parse(item);
      // 데이터를 사용하기 전에 검증하고 기본값을 채워줍니다.
      return validateAndHydrate(key, parsedItem);
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
