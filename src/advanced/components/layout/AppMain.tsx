// components/layout/AppMain.tsx
import AdminView from '../view/AdminView.tsx';
import ShoppingView from '../view/ShoppingView.tsx';
import { isAdminAtom } from '../../store/common/setting.store.ts';
import { useAtomValue } from 'jotai';

const AppMain = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {isAdmin ? <AdminView /> : <ShoppingView />}
    </main>
  );
};

export default AppMain;
