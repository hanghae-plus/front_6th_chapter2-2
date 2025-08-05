import Text, { sizeType } from './Text.tsx';

const Title = ({
  children,
  className,
  size = '2xl',
}: {
  children: React.ReactNode;
  className?: string;
  size?: sizeType;
}) => {
  return (
    <Text as={'h2'} size={size} weight={'semibold'} className={className}>
      {children}
    </Text>
  );
};

export default Title;
