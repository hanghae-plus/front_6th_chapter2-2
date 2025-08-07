import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const CloseIcon = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <svg className={className ?? 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};

export default CloseIcon;
