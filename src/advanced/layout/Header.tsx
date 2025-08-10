import { useAtom } from "jotai";
import SearchBar from "../components/ui/SearchBar";
import Logo from "../components/ui/Logo";
import HeaderNav from "./HeaderNav";
import { isAdminAtom, searchTermAtom, cartAtom } from "../atoms";

export default function Header() {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [cart] = useAtom(cartAtom);

  const handleToggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            <Logo />
            {/* 검색창 */}
            {!isAdmin && (
              <div className="ml-8 flex-1 max-w-md">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
            )}
          </div>
          <HeaderNav
            isAdmin={isAdmin}
            cart={cart}
            onToggleAdmin={handleToggleAdmin}
          />
        </div>
      </div>
    </header>
  );
}
