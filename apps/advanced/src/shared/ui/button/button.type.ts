import { PolymorphicProp } from '@/types';
import type { VariantProps } from 'class-variance-authority';
import { buttonStyle } from './button.css';
export type ButtonVariantProps = VariantProps<typeof buttonStyle>;

export type Props<E extends React.ElementType = 'button'> = PolymorphicProp<
  E,
  VariantProps<typeof buttonStyle>
>;
