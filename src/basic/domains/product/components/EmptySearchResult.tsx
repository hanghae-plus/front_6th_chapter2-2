type EmptySearchResultProps = {
  searchTerm: string;
};

export function EmptySearchResult({ searchTerm }: EmptySearchResultProps) {
  return (
    <div className="py-12 text-center">
      <p className="text-gray-500">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
    </div>
  );
}
