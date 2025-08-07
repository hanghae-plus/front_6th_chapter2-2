import { Notification } from '../types';
import { notificationsAtom } from '../../store/atoms/notificationAtom';
import { useAtom } from 'jotai';
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../constants';

export const useNotification = () => {
  const [notifications, dispatch] = useAtom(notificationsAtom);

  const addNotification = (
    message: string,
    type: Notification['type'] = 'success'
  ) => {
    const id = Date.now().toString();

    dispatch({ type: ADD_NOTIFICATION, payload: { id, message, type } });

    setTimeout(() => {
      dispatch({ type: REMOVE_NOTIFICATION, payload: { id } });
    }, 3000);
  };

  const removeNotification = (id: string) => {
    dispatch({ type: REMOVE_NOTIFICATION, payload: { id } });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
