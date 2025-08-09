import { useState } from "react";

import { AdminPage } from "./pages/AdminPage";
import { ShopPage } from "./pages/ShopPage";

import { Header } from "./components/ui/Header";
import { NotificationList } from "./components/ui/NotificationList";

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList />
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage /> : <ShopPage />}
      </main>
    </div>
  );
};

export default App;
