import { atomWithReducer } from 'jotai/utils';
import { Notification } from '../../shared/types';
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../../shared/constants';

type NotificationAction =
  | {
      type: typeof ADD_NOTIFICATION;
      payload: { id: string; message: string; type: Notification['type'] };
    }
  | { type: typeof REMOVE_NOTIFICATION; payload: { id: string } };

const notificationReducer = (
  state: Notification[],
  action: NotificationAction
) => {
  switch (action.type) {
    // 알림 추가
    case ADD_NOTIFICATION:
      return [...state, action.payload];

    // 알림 삭제
    case REMOVE_NOTIFICATION:
      return state.filter(
        notification => notification.id !== action.payload.id
      );

    default:
      return state;
  }
};

export const notificationsAtom = atomWithReducer<
  Notification[],
  NotificationAction
>([], notificationReducer);
