import { useTable } from 'react-table';

interface DynamicTableProps<T extends object> {
  columns: any;
  data: T[];
}

const DynamicTable = <T extends object>({ columns, data }: DynamicTableProps<T>) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td
                  {...cell.getCellProps()}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DynamicTable;