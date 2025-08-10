import { atomWithStorage } from "jotai/utils";
import { CartItem } from "../../types";

export const cartAtom = atomWithStorage<CartItem[]>("cart", []);
