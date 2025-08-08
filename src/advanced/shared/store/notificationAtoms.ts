import { atom } from "jotai";

import type { NotificationItem } from "../types";

export const notificationsAtom = atom<NotificationItem[]>([]);
