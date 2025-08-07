import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const AddIcon = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <svg className={className ?? 'w-8 h-8'} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
};

export default AddIcon;
