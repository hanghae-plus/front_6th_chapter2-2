import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const EmpIcon = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <svg
      className={className ?? 'w-16 h-16 text-gray-300 mx-auto mb-4'}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...rest}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
};

export default EmpIcon;
