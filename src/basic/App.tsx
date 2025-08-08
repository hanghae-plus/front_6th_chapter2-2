import { useState } from "react";
import { Coupon } from "../types";
import ShopPage from "./____pages/shop/ShopPage";
import AdminPage from "./____pages/admin/AdminPage";
import NotificationProvider from "./___features/notification/NotificationProvider";
import { Page, PageContext } from "./____pages/page-context";

const App = () => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Shop);

  const pageConfig = {
    admin: (
      <AdminPage
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
      />
    ),
    shop: (
      <ShopPage
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
      />
    ),
  };

  const moveTo = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <NotificationProvider>
      <PageContext value={{ currentPage, moveTo }}>
        {pageConfig[currentPage]}
      </PageContext>
    </NotificationProvider>
  );
};

export default App;
