import React, { useState, useEffect } from 'react';
import ProductTable from '../../../components/forms/TableDynamic';
import CreationForm from '../../../components/forms/CreationForm';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const Warehouse: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [formType, setFormType] = useState<'create' | 'update'>('create');

  const columns = React.useMemo(
    () => [
      {
        Header: 'WAREHOUSE',
        accessor: 'name',
      },
      {
        Header: 'PHONE NUMBER',
        accessor: 'phone',
      },
      {
        Header: 'CITY',
        accessor: 'city',
      },
      {
        Header: 'COUNTRY',
        accessor: 'country',
      },
      {
        Header: 'ZIP CODE',
        accessor: 'zipcode',
      },
      {
        Header: 'CREATED ON',
        accessor: 'createdOn',
        Cell: ({ value }: { value: string }) => (
          <span className="text-center text-blue-500 bg-blue-100 px-2 py-1 rounded">
            {new Date(value).toLocaleString()} {/* Format the date */}
          </span>
        ),
      },
      {
        Header: 'ACTION',
        accessor: 'action',
        Cell: ({ row }: { row: any }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(row.original)}
              className="p-2 rounded-lg text-green-500 hover:bg-green-100"
              title="View"
            >
              <FaEye className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
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
    const fetchWarehouses = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/warehouses/warehouses');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    fetchWarehouses();
  }, []);

  const handleCreate = async (formData: any) => {
    try {
      const response = await fetch('http://localhost:4000/api/warehouses/Addwarehouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setData(prevData => [...prevData, result]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating warehouse:', error);
    }
  };

  const handleUpdate = async (formData: any) => {
    if (selectedWarehouse) {
      try {
        const response = await fetch(`http://localhost:4000/api/warehouses/Updatewarehouses/${selectedWarehouse._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        setData(prevData =>
          prevData.map(w => (w._id === result._id ? result : w))
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error updating warehouse:', error);
      }
    }
  };

  const handleDelete = async (warehouse: any) => {
    try {
      await fetch(`http://localhost:4000/api/warehouses/Deletewarehouses/${warehouse._id}`, {
        method: 'DELETE',
      });
      setData(prevData => prevData.filter(w => w._id !== warehouse._id));
    } catch (error) {
      console.error('Error deleting warehouse:', error);
    }
  };

  const handleView = (warehouse: any) => {
    console.log('View', warehouse);
    // Add your view logic here
  };

  const handleEdit = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setFormType('update');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWarehouse(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <div className="container mx-auto px-4">
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
            onClick={() => {
              setFormType('create');
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Create Warehouse
          </button>
        </div>
        <div className="overflow-x-auto">
          <ProductTable columns={columns} data={data} />
        </div>
      </div>

      {isModalOpen && (
        <CreationForm
          fields={[
            { name: 'name', label: 'Warehouse Name', type: 'text', placeholder: 'Enter warehouse name' },
            { name: 'emailwarehouse', label: 'Email warehouse', type: 'text', placeholder: 'Enter email warehouse' },
            { name: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number' },
            { name: 'city', label: 'City', type: 'text', placeholder: 'Enter city' },
            { name: 'country', label: 'Country', type: 'text', placeholder: 'Enter country' },
            { name: 'zipcode', label: 'ZIP Code', type: 'text', placeholder: 'Enter ZIP code' },

          ]}
          onSubmit={formType === 'create' ? handleCreate : handleUpdate}
          onCancel={handleCloseModal}
          initialValues={selectedWarehouse || {}}
          title={formType === 'create' ? 'Create Warehouse' : 'Update Warehouse'}
          submitButtonLabel={formType === 'create' ? 'Create' : 'Update'}
        />
      )}
    </div>
  );
};

export default Warehouse;
