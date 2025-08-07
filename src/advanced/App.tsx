import { Product } from "../types";
import { AdminPage } from "./components/AdminPage";
import { CartPage } from "./components/CartPage";
import { UIToast } from "./components/ui/UIToast";
import { Layout } from "./components/layout/Layout";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useAtom } from "jotai";
import { searchTermAtom, isAdminAtom } from "./atoms";

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
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <Layout>
      <UIToast />
      <Layout.Header />
      <Layout.Main>
        {isAdmin ? (
          <AdminPage />
        ) : (
          <CartPage debouncedSearchTerm={debouncedSearchTerm} />
        )}
      </Layout.Main>
    </Layout>
  );
};

export default App;
