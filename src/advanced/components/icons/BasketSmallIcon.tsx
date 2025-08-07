import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const BasketSmallIcon = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <svg className={className ?? 'w-5 h-5 mr-2'} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
};

export default BasketSmallIcon;
