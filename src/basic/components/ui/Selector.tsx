import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  className?: string;
  focusStyle?: 'indigo' | 'blue';
}

export default function Select({
  children,
  className,
  focusStyle = 'indigo',
  ...props
}: SelectProps) {
  const baseClasses = 'w-full border border-gray-300 rounded px-3 py-2 text-sm';

  const focusClasses = {
    indigo: 'focus:ring-indigo-500 focus:border-indigo-500',
    blue: 'focus:outline-none focus:border-blue-500',
  };

  const classes = [baseClasses, focusClasses[focusStyle], className].filter(Boolean).join(' ');

  return (
    <select className={classes} {...props}>
      {children}
    </select>
  );
}
