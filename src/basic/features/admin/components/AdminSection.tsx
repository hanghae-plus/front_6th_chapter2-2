import { PropsWithChildren } from "react";

export default function AdminSection({ children }: PropsWithChildren) {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      {children}
    </section>
  );
}

const AdminSectionHeader = ({ children }: PropsWithChildren) => {
  return <div className="p-6 border-b border-gray-200">{children}</div>;
};

const AdminSectionTitle = ({ children }: PropsWithChildren) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

const AdminSectionContent = ({ children }: PropsWithChildren) => {
  return <div className="overflow-x-auto">{children}</div>;
};

AdminSection.Header = AdminSectionHeader;
AdminSection.Title = AdminSectionTitle;
AdminSection.Content = AdminSectionContent;
