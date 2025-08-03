import { sizeType } from './Text.tsx';
import { JSX } from 'react';

const Title = ({
  children,
  className,
  level,
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  size?: sizeType;
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClasses = {
    1: 'text-2xl font-bold',
    2: 'text-lg font-semibold',
    3: 'text-base font-medium',
    4: 'text-base font-medium',
    5: 'text-sm font-medium',
    6: 'text-sm font-medium',
  };

  return (
    <Component className={`${sizeClasses[level]} text-gray-900 ${className}`}>
      {children}
    </Component>
  );
};

export default Title;
