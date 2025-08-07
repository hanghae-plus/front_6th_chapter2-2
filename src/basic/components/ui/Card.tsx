import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md';
  header?: ReactNode;
  headerStyle?: 'border' | 'margin';
  contentPadding?: boolean;
}

export default function Card({
  children,
  className = '',
  padding = 'sm',
  header,
  headerStyle = 'margin',
  contentPadding = true,
}: CardProps) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
  };

  const finalPadding = header && !contentPadding ? 'none' : padding;
  const classes = [baseClasses, paddingClasses[finalPadding], className].filter(Boolean).join(' ');

  return (
    <section className={classes}>
      {header &&
        (headerStyle === 'border' ? (
          <div className='p-6 border-b border-gray-200'>{header}</div>
        ) : (
          header
        ))}
      {children}
    </section>
  );
}
