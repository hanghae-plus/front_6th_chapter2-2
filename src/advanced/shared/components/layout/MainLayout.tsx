import { PropsWithChildren } from "react";

export default function MainLayout({ children }: PropsWithChildren) {
  return <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>;
}
