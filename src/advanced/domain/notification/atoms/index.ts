import { atom } from "jotai";
import { Notification } from "../models";

export const notificationsAtom = atom<Notification[]>([]);
