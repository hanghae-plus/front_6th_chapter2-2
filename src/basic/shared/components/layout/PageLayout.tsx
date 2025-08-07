import { PropsWithChildren } from "react";

export default function PageLayout({ children }: PropsWithChildren) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
