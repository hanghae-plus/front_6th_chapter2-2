import Button from "./Button";

interface AdminToggleProps {
  isAdmin: boolean;
  onToggle: () => void;
  className?: string;
}

export default function AdminToggle({
  isAdmin,
  onToggle,
  className = "",
}: AdminToggleProps) {
  return (
    <Button
      onClick={onToggle}
      variant={isAdmin ? "black" : "ghost"}
      size="small"
      className={className}
    >
      {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
    </Button>
  );
}
