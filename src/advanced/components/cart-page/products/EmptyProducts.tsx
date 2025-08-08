interface Props {
  searchTerm: string;
}

export function EmptyProducts({ searchTerm }: Props) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">
        "{searchTerm}"에 대한 검색 결과가 없습니다.
      </p>
    </div>
  );
}
