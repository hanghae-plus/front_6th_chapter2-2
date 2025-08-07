import { atom } from 'jotai';
import { FormType } from '../../models/common/form.types.ts';

export const productFormAtom = atom<FormType>({
  name: '',
  price: 0,
  stock: 0,
  description: '',
  discounts: [],
});
