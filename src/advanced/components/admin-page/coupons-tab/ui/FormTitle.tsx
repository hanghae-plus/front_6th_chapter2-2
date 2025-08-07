import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function FormTitle({ children }: Props) {
  return <h3 className="text-md font-medium text-gray-900">{children}</h3>;
}
