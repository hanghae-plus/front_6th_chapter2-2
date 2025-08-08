import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const adminModeAtom = atomWithStorage("adminMode", false);
export const searchTermAtom = atom("");
