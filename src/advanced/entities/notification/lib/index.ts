import type { HTMLAttributes } from 'react';

import type { NotificationVariant } from '../consts';

export function getToastBgColorByVariant(
  variant: NotificationVariant
): HTMLAttributes<HTMLDivElement>['className'] {
  if (variant === 'error') return 'bg-red-600';
  if (variant === 'warning') return 'bg-yellow-600';
  if (variant === 'success') return 'bg-green-600';

  return 'bg-gray-600';
}
