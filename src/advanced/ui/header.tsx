import { CartIcon } from './icons';
import { SearchInput } from './search-input';
import { useCart } from '../contexts';
import { useTotalItemCount } from '@/shared/hooks';

interface HeaderProps {
  isAdmin: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleAdmin: () => void;
}

export function Header({ isAdmin, searchTerm, onSearchChange, onToggleAdmin }: HeaderProps) {
  const { cart } = useCart();
  const totalItemCount = useTotalItemCount(cart);
  return (
    <header className='bg-white shadow-sm sticky top-0 z-40 border-b'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center flex-1'>
            <h1 className='text-xl font-semibold text-gray-800'>SHOP</h1>
            {!isAdmin && <SearchInput searchTerm={searchTerm} onChange={onSearchChange} />}
          </div>
          <nav className='flex items-center space-x-4'>
            <button
              onClick={onToggleAdmin}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdmin ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
            </button>
            {!isAdmin && (
              <div className='relative'>
                <CartIcon />
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
  );
}
