import { atomWithStorage } from "jotai/utils";
import { CartItem } from "../type/types";

export const cartAtom = atomWithStorage<CartItem[]>("cart", []);
