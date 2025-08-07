import { atom } from 'jotai';

export const pageAtom = atom<'cart' | 'admin'>('cart');

export const gotoCartPageAtom = atom(null, (get, set) => {
  set(pageAtom, 'cart');
});

export const gotoAdminPageAtom = atom(null, (get, set) => {
  set(pageAtom, 'admin');
});
