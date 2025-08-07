import { useState } from "react";

import { Provider } from "jotai";

import { NotificationBoundary } from "@/advanced/features/notification/components/NotificationBoundary";
import { AdminPage, HomePage } from "@/advanced/pages";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Provider>
      <NotificationBoundary>
        {!isAdmin ? (
          <HomePage setIsAdmin={setIsAdmin} />
        ) : (
          <AdminPage setIsAdmin={setIsAdmin} />
        )}
      </NotificationBoundary>
    </Provider>
  );
};

export default App;
