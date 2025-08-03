import { useState } from 'react';
import z from 'zod';
import AdminPage from './pages/admin/page';
import { Notifications } from './pages/shopping/components/notifications';
import ShoppingPage from './pages/shopping/page';
import { useNotificationService } from './services';
import { useDebounceValue } from './shared/hooks';
import { useCartStore } from './store';

const pageEnum = z.enum(['SHOPPING_PAGE', 'ADMIN_PAGE']);

export const App = () => {
  const [currentPage, setCurrentPage] = useState<z.infer<typeof pageEnum>>(
    pageEnum.enum.SHOPPING_PAGE
  );
  const notificationService = useNotificationService();
  const { cart, totalItemCount } = useCartStore();

  const {
    value: searchTerm,
    setValue: setSearchTerm,
    debouncedValue: debouncedSearchTerm
  } = useDebounceValue('', 500);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Notifications
        notifications={notificationService.notifications}
        removeNotification={notificationService.removeNotification}
      />
      <header className='bg-white shadow-sm sticky top-0 z-40 border-b'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center flex-1'>
              <h1 className='text-xl font-semibold text-gray-800'>SHOP</h1>
              {currentPage === pageEnum.enum.SHOPPING_PAGE && (
                <div className='ml-8 flex-1 max-w-md'>
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder='상품 검색...'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                  />
                </div>
              )}
            </div>
            <nav className='flex items-center space-x-4'>
              {currentPage === pageEnum.enum.ADMIN_PAGE && (
                <button
                  onClick={() => setCurrentPage(pageEnum.enum.SHOPPING_PAGE)}
                  className={`px-3 py-1.5 text-sm rounded transition-colors bg-gray-800 text-white`}>
                  쇼핑몰로 돌아가기
                </button>
              )}
              {currentPage === pageEnum.enum.SHOPPING_PAGE && (
                <button
                  onClick={() => setCurrentPage(pageEnum.enum.ADMIN_PAGE)}
                  className={`px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900`}>
                  관리자 페이지로
                </button>
              )}
              {currentPage === pageEnum.enum.SHOPPING_PAGE && (
                <div className='relative'>
                  <svg
                    className='w-6 h-6 text-gray-700'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                  {cart.length > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                      {totalItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {currentPage === pageEnum.enum.SHOPPING_PAGE && (
        <ShoppingPage searchTerm={debouncedSearchTerm} />
      )}
      {currentPage === pageEnum.enum.ADMIN_PAGE && (
        <AdminPage searchTerm={debouncedSearchTerm} />
      )}
    </div>
  );
};
