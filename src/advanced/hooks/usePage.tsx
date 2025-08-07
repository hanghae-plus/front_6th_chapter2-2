import { useAtomValue, useSetAtom } from 'jotai';
import { gotoAdminPageAtom, gotoCartPageAtom, pageAtom } from '../atoms/page';

export function usePage() {
  return useAtomValue(pageAtom);
}

export function useGotoCartPage() {
  return useSetAtom(gotoCartPageAtom);
}

export function useGotoAdminPage() {
  return useSetAtom(gotoAdminPageAtom);
}
