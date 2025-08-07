import { useAtom } from 'jotai';

import { searchTermAtom, cartAtom, totalItemCountAtom, isAdminAtom } from '../../store/atoms';
import { CartIcon } from '../icons';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Header = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [cart] = useAtom(cartAtom);
  const [totalItemCount] = useAtom(totalItemCountAtom);
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
                <Input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='상품 검색...'
                  className='px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                />
              </div>
            )}
          </div>
          <nav className='flex items-center space-x-4'>
            <Button
              onClick={() => setIsAdmin(!isAdmin)}
              hasTransition
              hasTextSm
              hasRounded
              className={`px-3 py-1.5 ${
                isAdmin ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
            </Button>
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
};

export default Header;
