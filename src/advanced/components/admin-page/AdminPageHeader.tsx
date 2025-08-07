import { useGotoCartPage } from '../../hooks/usePage';
import { Header } from '../ui/Header';

export function AdminPageHeader() {
  const gotoCartPage = useGotoCartPage();

  return (
    <Header
      nav={
        <button
          onClick={gotoCartPage}
          className="px-3 py-1.5 text-sm rounded transition-colors bg-gray-800 text-white"
        >
          쇼핑몰로 돌아가기
        </button>
      }
    />
  );
}
