import { useAtom, useAtomValue } from "jotai";
import { type ChangeEvent } from "react";

import { totalItemCountAtom } from "../../domains/cart";
import { adminModeAtom, BadgeContainer, CartIcon, SearchInput, searchTermAtom } from "../../shared";
import { AdminToggleButton } from "./AdminToggleButton";

export function Header() {
  const [isAdminMode, setIsAdminMode] = useAtom(adminModeAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
            {!isAdminMode && (
              <div className="ml-8 flex max-w-md flex-1 gap-3">
                <SearchInput
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="상품 검색..."
                  color="blue"
                  size="lg"
                />
              </div>
            )}
          </div>

          <nav className="flex items-center space-x-4">
            <AdminToggleButton
              isAdmin={isAdminMode}
              onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
            />
            {!isAdminMode && (
              <BadgeContainer label={String(totalItemCount)} visible={totalItemCount > 0}>
                <CartIcon className="h-6 w-6 text-gray-700" />
              </BadgeContainer>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
