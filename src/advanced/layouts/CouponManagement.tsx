import { useAtom } from 'jotai';

import CouponForm from '../components/admin/CouponForm';
import CouponList from '../components/admin/CouponList';
import { showCouponFormAtom } from '../store/atoms';

export default function CouponManagement() {
  const [showCouponForm] = useAtom(showCouponFormAtom);

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <CouponList />

        {showCouponForm && <CouponForm />}
      </div>
    </section>
  );
}
