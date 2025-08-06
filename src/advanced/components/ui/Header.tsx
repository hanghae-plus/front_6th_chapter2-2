import { useAtom } from 'jotai';
import { CartItem } from '../../../types';
import { isAdminAtom } from '../../atoms/uiAtoms';
import Button from './Button';
import { CartIcon } from './Icons';

interface HeaderProps {
  query: string;
  setQuery: (value: string) => void;
  cart: CartItem[];
  totalCartItem: number;
}

export default function Header({ query, setQuery, cart, totalCartItem }: HeaderProps) {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

  return (
    <header className='bg-white shadow-sm sticky top-0 z-40 border-b'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center flex-1'>
            <h1 className='text-xl font-semibold text-gray-800'>SHOP</h1>
            {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
            {!isAdmin && (
              <div className='ml-8 flex-1 max-w-md'>
                <input
                  type='text'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='상품 검색...'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                />
              </div>
            )}
          </div>
          <nav className='flex items-center space-x-4'>
            <Button
              variant={isAdmin ? 'primary' : 'ghost'}
              size='sm'
              onClick={() => setIsAdmin(!isAdmin)}
            >
              {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
            </Button>
            {!isAdmin && (
              <div className='relative'>
                <CartIcon />
                {cart.length > 0 && (
                  <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                    {totalCartItem}
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
