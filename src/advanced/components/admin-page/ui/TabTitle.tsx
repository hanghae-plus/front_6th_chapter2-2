import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function TabTitle({ children }: Props) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}
