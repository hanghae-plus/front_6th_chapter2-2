import { atom } from "jotai";
import { Notification } from "../type/types";

export const notificationsAtom = atom<Notification[]>([]);
