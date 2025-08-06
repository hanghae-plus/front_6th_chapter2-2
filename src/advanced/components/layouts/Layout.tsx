interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
};
