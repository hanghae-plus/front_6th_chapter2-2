import { IconProps } from "@/basic/components/icons/Icon";

export function CartIcon({
  size = 6,
  color = "text-gray-700",
  className = "",
  onClick,
  disabled = false,
}: IconProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  const baseClasses = `w-${size} h-${size} ${color} ${className}`;
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <svg
      className={`${baseClasses} ${disabledClasses}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      onClick={handleClick}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
