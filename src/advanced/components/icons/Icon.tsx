import { type HTMLAttributes } from 'react';

import { iconNames } from './iconNames';

interface IconProps extends HTMLAttributes<SVGElement> {
  name: keyof typeof iconNames;
  width?: number;
  height?: number;
}

export function Icon({ name, width, height, ...props }: IconProps) {
  return (
    <svg width={width} height={height} {...props}>
      <use href={`#${name}-icon`} />
    </svg>
  );
}
