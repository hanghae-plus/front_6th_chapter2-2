import AdminPage from '@/basic/pages/admin/page';
import ShoppingPage from '@/basic/pages/shopping/page';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: ShoppingPage,
    },
    {
      path: '/admin',
      Component: AdminPage,
    },
  ],
  {
    basename: '/index.basic.html',
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
