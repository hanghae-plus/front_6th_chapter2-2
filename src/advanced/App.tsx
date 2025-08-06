import { useAtomValue } from "jotai";
import { isAdminAtom } from "./atoms";

import { Header } from "./components/layouts/Header";
import { Layout } from "./components/layouts/Layout";
import { Body } from "./components/layouts/Body";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { NotificationComponent } from "./components/ui/notification/Notification";

const App = () => {
  const isAdmin = useAtomValue(isAdminAtom);

  return (
    <Layout>
      <NotificationComponent />

      <Header />

      <Body>{isAdmin ? <AdminPage /> : <CartPage />}</Body>
    </Layout>
  );
};

export default App;
