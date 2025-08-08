import { atom, useAtom } from "jotai"
import { Notification } from "../entities/Notification.ts"

const atomNotifications = atom<Notification[]>([])

export function useNotification() {
  const [notifications, setNotifications] = useAtom(atomNotifications)

  function handleNotificationAdd(message: string, type: "error" | "success" | "warning" = "success") {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }

  return { notifications, setNotifications, handleNotificationAdd }
}
