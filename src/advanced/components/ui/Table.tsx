import type { ReactNode } from 'react';
import { entries } from '../../utils/object';

type Row<Label extends string, Data extends { id: string }> = Record<
  Label,
  {
    className?: string;
    children: (data: Data) => ReactNode;
  }
>;

interface Props<Label extends string, Data extends { id: string }> {
  datas: Data[];
  row: Row<Label, Data>;
}

export function Table<Label extends string, Data extends { id: string }>({
  datas,
  row,
}: Props<Label, Data>) {
  const labels = Object.keys(row);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {labels.map((label) => {
              return (
                <th
                  key={label}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {label}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {datas.map((data) => {
            return (
              <tr key={data.id} className="hover:bg-gray-50">
                {entries(row).map(([label, { className, children }]) => {
                  return (
                    <td key={label} className={className}>
                      {children(data)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
