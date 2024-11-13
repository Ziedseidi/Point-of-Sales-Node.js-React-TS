import React, { useState, useEffect } from 'react';
import ProductTable from '../../../components/forms/TableDynamic';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CreationForm from '../../../components/forms/CreationForm';

const Units: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const columns = React.useMemo(
    () => [
      {
        Header: 'NAME',
        accessor: 'name',
      },
      {
        Header: 'SHORT NAME',
        accessor: 'shortname',
        Cell: ({ value }: { value: string }) => (
          <span className="bg-blue-100 text-blue-500 px-2 py-1 rounded">
            {value}
          </span>
        ),
      },
      {
        Header: 'BASE UNIT',
        accessor: 'baseunit',
        Cell: ({ value }: { value: string }) => (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
            {value}
          </span>
        ),
      },
      {
        Header: 'CREATED ON',
        accessor: 'creationDate',
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
    const fetchUnits = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/units/units');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };

    fetchUnits();
  }, []);

  const handleCreate = async (formData: { [key: string]: any }, file?: File | null) => {
    const newUnit = { ...formData, creationDate: new Date().toISOString() };

    try {
      const response = await fetch('http://localhost:4000/api/units/Addunit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUnit),
      });
      const result = await response.json();
      setData(prevData => [...prevData, result]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating unit:', error);
    }
  };

  const handleUpdate = async (unit: any) => {
    const updatedUnit = {
      ...unit,
      name: 'Updated Unit Name', // Change as needed
    };

    try {
      const response = await fetch(`http://localhost:4000/api/units/${unit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUnit),
      });
      const result = await response.json();
      setData(prevData =>
        prevData.map(u => (u._id === result._id ? result : u))
      );
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };

  const handleDelete = async (unit: any) => {
    try {
      await fetch(`http://localhost:4000/api/units/${unit._id}`, {
        method: 'DELETE',
      });
      setData(prevData => prevData.filter(u => u._id !== unit._id));
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'shortname', label: 'Short Name', type: 'text' },
    { name: 'baseunit', label: 'Base Unit', type: 'text' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <div className="flex justify-between items-center mb-4">
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Create Unit
        </button>
      </div>
      <ProductTable columns={columns} data={data} />

      {isModalOpen && (
        <CreationForm
          fields={fields}
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          title="Create Unit"
          submitButtonLabel="Save"
        />
      )}
    </div>
  );
};

export default Units;
