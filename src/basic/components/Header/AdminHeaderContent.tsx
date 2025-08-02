interface AdminHeaderContentProps {
  onToggleContent: () => void;
}

const AdminHeaderContent = ({ onToggleContent }: AdminHeaderContentProps) => {
  return (
    <>
      <div className="flex items-center flex-1">
        <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <button
          onClick={onToggleContent}
          className="px-3 py-1.5 text-sm rounded transition-colors bg-gray-800 text-white"
        >
          쇼핑몰로 돌아가기
        </button>
      </nav>
    </>
  );
};

export default AdminHeaderContent;
