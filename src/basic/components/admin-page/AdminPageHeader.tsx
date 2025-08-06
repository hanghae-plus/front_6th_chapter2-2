import { Header } from '../ui/Header';

interface Props {
  setIsAdmin: (value: boolean) => void;
}

export function AdminPageHeader({ setIsAdmin }: Props) {
  return (
    <Header
      nav={
        <button
          onClick={() => setIsAdmin(false)}
          className="px-3 py-1.5 text-sm rounded transition-colors bg-gray-800 text-white"
        >
          쇼핑몰로 돌아가기
        </button>
      }
    />
  );
}
