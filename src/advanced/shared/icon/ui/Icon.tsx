import { type HTMLAttributes } from 'react';

import type { IconName } from '../consts/iconNames';

interface IconProps extends HTMLAttributes<SVGElement> {
  name: IconName;
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
