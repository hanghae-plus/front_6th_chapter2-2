import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ProductWithUI } from '../entities/product';

// 상품 목록 (로컬 스토리지와 연동)
export const productsAtom = atomWithStorage<ProductWithUI[]>('products', []);

// 관리자 모드 상태
export const isAdminAtom = atom<boolean>(false);
