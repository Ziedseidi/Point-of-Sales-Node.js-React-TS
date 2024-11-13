import React, { useEffect, useState } from 'react';
import DynamicTable from '../../../components/forms/brandTable';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CreationForm from '../../../components/forms/CreationForm';// Import the PopupForm component

interface Brand {
  _id: string;
  name: string;
  logoBrand?: string;
  productCount: number;
}

const Brands: React.FC = () => {
  const [data, setData] = useState<Brand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState<Brand>({ _id: '', name: '', logoBrand: '', productCount: 0 });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/brands/brands');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ value, row }: { value: string; row: { original: Brand } }) => {
        const brand = row.original;
        const logoPath = brand.logoBrand
          ? `/uploads/${brand.logoBrand}`
          : 'https://via.placeholder.com/150';

        return (
          <div className="flex items-center">
            <img
              src={logoPath}
              alt={value}
              className="w-12 h-12 object-cover rounded-full mr-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
              }}
            />
            {value}
          </div>
        );
      },
    },
    {
      Header: 'Product Count',
      accessor: 'productCount',
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }: { row: { original: Brand } }) => {
        const brand = row.original;

        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(brand)}
              className="p-2 rounded-lg text-blue-500 hover:bg-blue-100"
              title="Edit"
            >
              <FaEdit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(brand)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-100"
              title="Delete"
            >
              <FaTrash className="h-5 w-5" />
            </button>
          </div>
        );
      },
    },
  ];

  const handleEdit = (brand: Brand) => {
    setNewBrand(brand);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (brand: Brand) => {
    try {
      const response = await fetch(`http://localhost:4000/api/brands/Deletebrand/${brand._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await fetchBrands();
    } catch (error) {
      console.error('Failed to delete brand:', error);
    }
  };

  const handleOpenModal = () => {
    setNewBrand({ _id: '', name: '', logoBrand: '', productCount: 0 });
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async (formData: { [key: string]: any }, file?: File | null) => {
    try {
      const url = editMode
        ? `http://localhost:4000/api/brands/Updatebrand/${newBrand._id}`
        : 'http://localhost:4000/api/brands/Addbrand';

      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      if (file) formDataObj.append('logoBrand', file);

      const response = await fetch(url, {
        method: editMode ? 'PATCH' : 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Network response was not ok: ${errorDetails}`);
      }

      await fetchBrands();
      handleCloseModal();
    } catch (error: any) {
      console.error('Failed to save brand:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search"
          />
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          aria-label="Create brand"
        >
          Create brand
        </button>
      </div>
      <DynamicTable columns={columns} data={data} />

      {isModalOpen && (
        <CreationForm
          fields={[
            { name: 'name', label: 'Brand Name', type: 'text', placeholder: 'Enter brand name', value: newBrand.name },
            { name: 'logoBrand', label: 'Brand Logo', type: 'file' },
          ]}
          onSubmit={handleSave}
          onCancel={handleCloseModal}
          initialValues={newBrand}
          title={editMode ? 'Edit Brand' : 'Create Brand'}
          submitButtonLabel={editMode ? 'Update' : 'Save'}
        />
      )}
    </div>
  );
};

export default Brands;
