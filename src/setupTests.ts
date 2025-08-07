import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';

// 테스트 환경을 위한 localStorage 모의(mock) 객체
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

// window.localStorage를 모의 객체로 교체
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// 각 테스트가 독립적으로 실행되도록 테스트 시작 전에 localStorage를 초기화
beforeEach(() => {
  localStorage.clear();
});