import { tv } from "tailwind-variants";

type AdminToggleButtonProps = {
  isAdmin: boolean;
  onToggleAdminMode: () => void;
};

const adminToggle = tv({
  base: "rounded px-3 py-1.5 text-sm transition-colors",
  variants: {
    mode: {
      admin: "bg-gray-800 text-white",
      cart: "text-gray-600 hover:text-gray-900"
    }
  }
});

export function AdminToggleButton({ isAdmin, onToggleAdminMode }: AdminToggleButtonProps) {
  const buttonClassName = adminToggle({ mode: isAdmin ? "admin" : "cart" });

  return (
    <button onClick={onToggleAdminMode} className={buttonClassName}>
      {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
    </button>
  );
}
