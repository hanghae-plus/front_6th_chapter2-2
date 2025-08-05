import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type Nullable<T> = T | null;
export type Undefinable<T> = T | undefined;

export type PolymorphicProp<E extends ElementType, T> = Omit<
  ComponentPropsWithoutRef<E>,
  keyof T
> & {
  as?: E;
  asChild?: boolean;
} & T;
