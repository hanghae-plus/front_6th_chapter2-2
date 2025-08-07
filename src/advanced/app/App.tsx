import { useState } from 'react';

import { AdminPage } from '../pages/admin';
import { CartPage } from '../pages/cart';

export const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      {isAdmin ? (
        <AdminPage onChangeCartPage={() => setIsAdmin(false)} />
      ) : (
        <CartPage onChangeAdminPage={() => setIsAdmin(true)} />
      )}
    </div>
  );
};
