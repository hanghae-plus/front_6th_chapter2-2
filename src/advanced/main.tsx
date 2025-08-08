import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NotificationProvider } from "./entities/notification/model/NotificationProvider";
import { ProductProvider } from "./entities/product/model/ProductProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotificationProvider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </NotificationProvider>
  </React.StrictMode>
);
