import { PropsWithChildren } from "react";

export default function DashBoardLayout({ children }: PropsWithChildren) {
  return <div className="max-w-6xl mx-auto">{children}</div>;
}
