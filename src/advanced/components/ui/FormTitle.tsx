import type { ReactNode } from 'react';

type Size = 'md' | 'lg';

interface FormTitleProps {
  children: ReactNode;
  size?: Size;
  className?: string;
}

const titleSizes: Record<Size, string> = {
  md: 'text-md font-medium text-gray-900',
  lg: 'text-lg font-medium text-gray-900',
};

export function FormTitle({
  children,
  size = 'lg',
  className = '',
}: FormTitleProps) {
  const sizeClasses = titleSizes[size];
  const combinedClasses = `${sizeClasses} ${className}`;

  return <h3 className={combinedClasses}>{children}</h3>;
}
