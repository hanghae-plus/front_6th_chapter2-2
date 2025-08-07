import { Product } from "../types";
import { AdminPage } from "./components/AdminPage";
import { CartPage } from "./components/CartPage";
import { UIToast } from "./components/ui/UIToast";
import { Layout } from "./components/layout/Layout";
import { useAtom } from "jotai";
import { isAdminAtom } from "./atoms";

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const App = () => {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

  return (
    <Layout>
      <UIToast />
      <Layout.Header />
      <Layout.Main>{isAdmin ? <AdminPage /> : <CartPage />}</Layout.Main>
    </Layout>
  );
};

export default App;
