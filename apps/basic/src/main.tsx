import AdminPage from '@/pages/admin/page';
import ShoppingPage from '@/pages/shopping/page';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    Component: ShoppingPage
  },
  {
    path: '/admin',
    Component: AdminPage
  }
]);

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
