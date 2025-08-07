import { atom } from 'jotai';
import type { Notification } from '../../types';
import * as notificationModel from '../models/notification';

export const notificationsAtom = atom<Notification[]>([]);

export const addNotificationAtom = atom(
  null,
  (get, set, { message, type, id }: Notification) => {
    const notifications = get(notificationsAtom);
    const updatedNotifications = notificationModel.addNotification({
      notifications,
      id,
      message,
      type,
    });

    set(notificationsAtom, updatedNotifications);
  }
);

export const removeNotificationAtom = atom(
  null,
  (get, set, { id }: { id: string }) => {
    const notifications = get(notificationsAtom);
    const updatedNotifications = notificationModel.removeNotification({
      id,
      notifications,
    });

    set(notificationsAtom, updatedNotifications);
  }
);
