import { atomWithStorage } from "jotai/utils";
import { CartItem } from "../../../types";

// 장바구니 상태 atom
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);
