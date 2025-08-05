import Text, { sizeType, weightType } from './Text.tsx';

const Title = ({
  children,
  className,
  as = 'h2',
  bold = 'semibold',
  size = '2xl',
}: {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  bold?: weightType;
  children: React.ReactNode;
  className?: string;
  size?: sizeType;
}) => {
  return (
    <Text as={as} size={size} weight={bold} className={className}>
      {children}
    </Text>
  );
};

export default Title;
