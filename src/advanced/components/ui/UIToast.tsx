import { CloseIcon } from "../icons";
import { notificationsAtom } from "../../atoms";
import { useAtom } from "jotai";

export function UIToast() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  return (
    <>
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === "error"
                  ? "bg-red-600"
                  : notif.type === "warning"
                  ? "bg-yellow-600"
                  : "bg-green-600"
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notif.id)
                  )
                }
                className="text-white hover:text-gray-200"
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
