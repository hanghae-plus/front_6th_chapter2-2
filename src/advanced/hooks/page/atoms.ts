import { atom } from 'jotai';

export const pageAtom = atom<'cart' | 'admin'>('cart');

export const gotoCartPageAtom = atom(null, (_, set) => {
  set(pageAtom, 'cart');
});

export const gotoAdminPageAtom = atom(null, (_, set) => {
  set(pageAtom, 'admin');
});
