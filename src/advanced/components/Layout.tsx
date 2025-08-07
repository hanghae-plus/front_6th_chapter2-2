import React from 'react';
interface LayoutProps {
  Header: React.ReactNode;
  NotificationContainer: React.ReactNode;
  children: React.ReactNode;
}
const Layout = ({ Header, NotificationContainer, children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {Header}
      {NotificationContainer}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
