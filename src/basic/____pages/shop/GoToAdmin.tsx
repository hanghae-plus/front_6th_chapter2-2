import { Page, usePage } from "../page-context";

function GoToAdminButton() {
  const { moveTo } = usePage();

  return (
    <button
      onClick={() => moveTo(Page.Admin)}
      className="px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900"
    >
      관리자 페이지로
    </button>
  );
}

export default GoToAdminButton;
