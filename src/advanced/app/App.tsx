import { useAtomValue } from "jotai";

import { adminModeAtom, useNotifications } from "../shared";
import { Header, NotificationList } from "./components";
import { AdminPage, CartPage } from "./pages";

export function App() {
  const { notifications, removeNotification } = useNotifications();
  const isAdminMode = useAtomValue(adminModeAtom);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {isAdminMode ? <AdminPage /> : <CartPage />}
      </main>
      <NotificationList notifications={notifications} onRemove={removeNotification} />
    </div>
  );
}
