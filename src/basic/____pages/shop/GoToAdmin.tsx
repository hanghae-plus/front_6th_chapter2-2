import { use } from "react";
import { AdminContext } from "../admin-context";

function GoToAdminButton() {
  const { setIsAdmin } = use(AdminContext);

  return (
    <button
      onClick={() => setIsAdmin(true)}
      className="px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900"
    >
      관리자 페이지로
    </button>
  );
}

export default GoToAdminButton;
