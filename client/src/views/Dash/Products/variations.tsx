import React, { useState, useEffect } from 'react';
import ProductTable from '../../../components/forms/TableDynamic';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CreationForm from '../../../components/forms/CreationForm';

const Variations: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState<{ [key: string]: any }>({ name: '', variationType: [] });

  const columns = React.useMemo(
    () => [
      {
        Header: 'VARIATION NAME',
        accessor: 'name',
      },
      {
        Header: 'VARIATION TYPES',
        accessor: 'Variationtype',
        Cell: ({ cell }: { cell: any }) => cell.value.join(', '), 
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
    const fetchVariations = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/variations/variations');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching variations:', error);
      }
    };

    fetchVariations();
  }, []);

  const handleCreate = async (formData: { [key: string]: any }, file?: File | null) => {
    const newVariation = { name: formData.name, Variationtype: formData.variationType };

    try {
      const response = await fetch('http://localhost:4000/api/variations/Addvariation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVariation),
      });
      const result = await response.json();
      setData(prevData => [...prevData, result]);
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating variation:', error);
    }
  };

  const handleUpdate = async (variation: any) => {
    const updatedVariation = {
      ...variation,
      name: 'Updated Variation Name', // Change as needed
    };

    try {
      const response = await fetch(`http://localhost:4000/api/variations/${variation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedVariation),
      });
      const result = await response.json();
      setData(prevData =>
        prevData.map(v => (v._id === result._id ? result : v))
      );
    } catch (error) {
      console.error('Error updating variation:', error);
    }
  };

  const handleDelete = async (variation: any) => {
    try {
      await fetch(`http://localhost:4000/api/variations/${variation._id}`, {
        method: 'DELETE',
      });
      setData(prevData => prevData.filter(v => v._id !== variation._id));
    } catch (error) {
      console.error('Error deleting variation:', error);
    }
  };

  const resetForm = () => {
    setFormInitialValues({ name: '', variationType: [] });
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Create variation
        </button>
      </div>
      <ProductTable columns={columns} data={data} />
      
      {isModalOpen && (
        <CreationForm
          fields={[
            { name: 'name', label: 'Variation Name', type: 'text', placeholder: 'Enter variation name' },
            { name: 'variationType', label: 'Variation Types', type: 'text', placeholder: 'Comma-separated types' }
          ]}
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          initialValues={formInitialValues}
          title="Create Variation"
          submitButtonLabel="Save"
        />
      )}
    </div>
  );
};

export default Variations;
