import type { SVGProps } from "react";

type PlusIconProps = SVGProps<SVGSVGElement>;

export function PlusIcon({ className = "w-6 h-6", ...rest }: PlusIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...rest}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
