import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: ReactNode;
}

export default function Card({ children, className = '', padding = 'md', header }: CardProps) {
  const baseClasses = 'bg-white rounded-lg border border-gray-200';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const classes = [baseClasses, paddingClasses[padding], className].filter(Boolean).join(' ');

  return (
    <section className={classes}>
      {header && <div className='border-b border-gray-200 pb-4 mb-4'>{header}</div>}
      {children}
    </section>
  );
}
