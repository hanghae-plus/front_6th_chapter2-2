interface HeaderLayoutProps {
  children: React.ReactNode;
}

const HeaderLayout = ({ children }: HeaderLayoutProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {children}
        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;