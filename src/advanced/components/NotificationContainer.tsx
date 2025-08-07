import { useEffect, useRef } from 'react';
import CloseIcon from './icons/CloseIcon';
import { useNotifications } from '../store/hooks';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // 새로운 알림에 대해서만 타이머 설정
  useEffect(() => {
    notifications.forEach(notification => {
      if (!timersRef.current.has(notification.id)) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
          timersRef.current.delete(notification.id);
        }, 3000);
        timersRef.current.set(notification.id, timer);
      }
    });

    // 더 이상 존재하지 않는 알림의 타이머 정리
    timersRef.current.forEach((timer, id) => {
      if (!notifications.find(n => n.id === id)) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    });
  }, [notifications, removeNotification]);

  // 컴포넌트 언마운트 시 모든 타이머 정리
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
            notif.type === 'error' ? 'bg-red-600' : notif.type === 'warning' ? 'bg-yellow-600' : 'bg-green-600'
          }`}
        >
          <span className="mr-2">{notif.message}</span>
          <button onClick={() => removeNotification(notif.id)} className="text-white hover:text-gray-200">
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
