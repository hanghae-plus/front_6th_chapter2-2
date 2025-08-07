import Button from '../ui/Button';

interface AdminTabsProps {
  activeTab: 'products' | 'coupons';
  setActiveTab: (tab: 'products' | 'coupons') => void;
}

const AdminTabs = ({ activeTab, setActiveTab }: AdminTabsProps) => {
  return (
    <div className='border-b border-gray-200 mb-6'>
      <nav className='-mb-px flex space-x-8'>
        <Button
          onClick={() => setActiveTab('products')}
          hasTransition
          hasFontMedium
          hasTextSm
          className={`py-2 px-1 border-b-2 ${
            activeTab === 'products'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          상품 관리
        </Button>
        <Button
          onClick={() => setActiveTab('coupons')}
          hasTransition
          hasFontMedium
          hasTextSm
          className={`py-2 px-1 border-b-2 ${
            activeTab === 'coupons'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          쿠폰 관리
        </Button>
      </nav>
    </div>
  );
};

export default AdminTabs;
