import { clsx } from 'clsx';
import z from 'zod';
import { tabTypeSchema } from '../page';

type Props = {
  activeTab: z.infer<typeof tabTypeSchema>;
  onTabChange: (tab: z.infer<typeof tabTypeSchema>) => void;
};

const Header = ({ activeTab, onTabChange }: Props) => {
  return (
    <>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>관리자 대시보드</h1>
        <p className='text-gray-600 mt-1'>상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className='border-b border-gray-200 mb-6'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => onTabChange(tabTypeSchema.enum.PRODUCTS)}
            className={clsx([
              `py-2 px-1 border-b-2 font-medium text-sm transition-colors`,
              activeTab === tabTypeSchema.enum.PRODUCTS
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ])}>
            상품 관리
          </button>
          <button
            onClick={() => onTabChange(tabTypeSchema.enum.COUPONS)}
            className={clsx([
              `py-2 px-1 border-b-2 font-medium text-sm transition-colors`,
              activeTab === tabTypeSchema.enum.COUPONS
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ])}>
            쿠폰 관리
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;
