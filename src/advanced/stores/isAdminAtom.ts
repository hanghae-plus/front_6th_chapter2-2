import { atomWithStorage } from "jotai/utils";

export const isAdminAtom = atomWithStorage<boolean>("isAdmin", false);
