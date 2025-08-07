import { Icon } from '../../shared/icon';

interface CouponAddButtonProps {
  onAddNew: () => void;
}

export function CouponAddButton({ onAddNew }: CouponAddButtonProps) {
  return (
    <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
      <button
        onClick={onAddNew}
        className='text-gray-400 hover:text-gray-600 flex flex-col items-center'
      >
        <Icon name='plus' width={32} height={32} />
        <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
      </button>
    </div>
  );
}
