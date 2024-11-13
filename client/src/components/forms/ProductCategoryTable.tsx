import React from 'react';
import { useTable } from 'react-table';

interface ProductCategory {
  _id: string;
  name: string;
  logoCategory?: string;
  productCount: number;
}

interface ProductCategoryTableProps {
  columns: any[];
  data: ProductCategory[];
}

const ProductCategoryTable: React.FC<ProductCategoryTableProps> = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="p-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="p-4 border-b border-gray-200 text-sm text-gray-600">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductCategoryTable;
