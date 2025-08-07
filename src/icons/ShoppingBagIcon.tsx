interface ShoppingBagIconProps {
  className?: string;
}

export const ShoppingBagIcon = ({ className = 'w-5 h-5 mr-2' }: ShoppingBagIconProps) => {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
};
