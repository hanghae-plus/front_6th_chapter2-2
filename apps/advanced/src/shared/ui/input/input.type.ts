import { PolymorphicProp } from '@/types';
import type { VariantProps } from 'class-variance-authority';
import { inputStyle } from './input.css';

export type Props<E extends React.ElementType = 'input'> = PolymorphicProp<
  E,
  VariantProps<typeof inputStyle>
>;
