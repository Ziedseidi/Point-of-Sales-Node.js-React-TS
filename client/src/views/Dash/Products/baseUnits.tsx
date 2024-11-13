import React from 'react';
import ProductTable from '../../../components/forms/TableDynamic';
import { FaEdit, FaTrash } from 'react-icons/fa';

const BaseUnits: React.FC = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'NAME',
        accessor: 'name',
      },
      
      {
        Header: 'ACTION',
        accessor: 'action',
        Cell: ({ row }: { row: any }) => (
          <div className="flex space-x-2">
            
            <button
              onClick={() => handleUpdate(row.original)}
              className="p-2 rounded-lg text-blue-500 hover:bg-blue-100"
              title="Edit"
            >
              <FaEdit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-100"
              title="Delete"
            >
              <FaTrash className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        id: 1,
        name: 'BKS',
       
      },
      {
        id: 2,
        name: 'литр',
       
      },
      
    ],
    []
  );

  const handleUpdate = (category: any) => {
    console.log('Update', category);
    // Add your update logic here
  };

  const handleDelete = (category: any) => {
    console.log('Delete', category);
    // Add your delete logic here
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.243 4.243a1 1 0 01-1.414 1.414l-4.243-4.243zm-1.414 0A6 6 0 1111 5a6 6 0 010 12z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Create variation
        </button>
      </div>
      <ProductTable columns={columns} data={data} />
    </div>
  );
};

export default BaseUnits;
