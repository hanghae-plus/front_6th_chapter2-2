import { ReactNode } from "react";

interface Props<T> {
  list: T[];
  renderItem: (item: T) => ReactNode;
  emptyView?: ReactNode;
  className?: string;
}

function ListView<T>({ list, renderItem, emptyView, className }: Props<T>) {
  if (list.length === 0) {
    return emptyView;
  }

  return <div className={className}>{list.map(renderItem)}</div>;
}

export default ListView;
