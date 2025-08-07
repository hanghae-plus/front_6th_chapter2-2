import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const DefaultImageIcon = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <svg
      className={className ?? 'w-24 h-24 text-gray-300'}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...rest}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
};

export default DefaultImageIcon;
