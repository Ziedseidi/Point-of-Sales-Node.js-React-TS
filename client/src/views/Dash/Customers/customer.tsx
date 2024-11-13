import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../../../components/forms/TableDynamic';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'CUSTOMER',
        accessor: 'name',
        Cell: ({ value }: { value: string }) => (
          <div className="pl-8 w-[2.5rem] text-left">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              {value}
            </span>
          </div>
        ),
      },
      {
        Header: 'PHONE NUMBER',
        accessor: 'phone',
      },
      {
        Header: 'CREATED ON',
        accessor: 'createdOn',
        Cell: ({ value }: { value: string }) => (
          <span className="text-center text-blue-500 bg-blue-100 px-2 py-1 rounded">
            {new Date(value).toLocaleString()}
          </span>
        ),
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

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/customers/customers');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleView = (customer: any) => {
    console.log('View', customer);
    // Add your view logic here
  };

  const handleUpdate = (customer: any) => {
    console.log('Update', customer);
    // Add your update logic here
  };

  const handleDelete = async (customer: any) => {
    try {
      await fetch(`http://localhost:4000/api/customers/DeleteCustomers/${customer._id}`, {
        method: 'DELETE',
      });
      setData(prevData => prevData.filter(w => w._id !== customer._id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <div className="container mx-auto px-4"> {/* Center and adjust container width */}
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
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => navigate('/dashboard/Addcustomer')}
          >
            Create Customer
          </button>
        </div>
        <div className="overflow-x-auto">
          <ProductTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Customers;
