import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function FormTitle({ children }: Props) {
  return <h3 className="text-lg font-medium text-gray-900">{children}</h3>;
}
