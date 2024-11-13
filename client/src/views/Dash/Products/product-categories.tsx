import React, { useEffect, useState } from 'react';
import ProductCategoryTable from '../../../components/forms/ProductCategoryTable';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CreationForm from '../../../components/forms/CreationForm'; // Import du formulaire dynamique

interface ProductCategory {
  _id: string;
  name: string;
  logoCategory?: string;
  productCount: number;
}

const ProductCategoriesPage: React.FC = () => {
  const [data, setData] = useState<ProductCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<ProductCategory>({ _id: '', name: '', logoCategory: '', productCount: 0 });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProductCategories();
  }, []);

  const fetchProductCategories = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/categories/categories');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch product categories:', error);
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setNewCategory(category);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: ProductCategory) => {
    try {
      const response = await fetch(`http://localhost:4000/api/categories/Deletecategory/${category._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await fetchProductCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleOpenModal = () => {
    setNewCategory({ _id: '', name: '', logoCategory: '', productCount: 0 });
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async (formData: { [key: string]: any }, file?: File | null) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (file) {
        formDataToSend.append('logoCategory', file);
      }

      const url = editMode
        ? `http://localhost:4000/api/categories/Updatecategory/${newCategory._id}`
        : 'http://localhost:4000/api/categories/Addcategory';

      const response = await fetch(url, {
        method: editMode ? 'PATCH' : 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Network response was not ok: ${errorDetails}`);
      }

      await fetchProductCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const columns = [
    {
      Header: 'Category',
      accessor: 'logoCategory',
      Cell: ({ row }: { row: { original: ProductCategory } }) => {
        const { name, logoCategory } = row.original;
        return (
          <div className="flex items-center space-x-4">
            <img
              src={logoCategory ? `/uploads/${logoCategory}` : 'https://via.placeholder.com/150'}
              alt="Category Logo"
              className="w-12 h-12 object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
              }}
            />
            <span className="text-gray-700">{name}</span>
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
      Cell: ({ row }: { row: { original: ProductCategory } }) => {
        const category = row.original;

        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(category)}
              className="p-2 rounded-lg text-blue-500 hover:bg-blue-100"
              title="Edit"
            >
              <FaEdit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(category)}
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
          aria-label="Create Category"
        >
          Create Product Category
        </button>
      </div>
      <ProductCategoryTable columns={columns} data={data} />

      {isModalOpen && (
        <CreationForm
          fields={[
            { name: 'name', label: 'Category Name', type: 'text', placeholder: 'Enter category name' },
            { name: 'logoCategory', label: 'Category Logo', type: 'file' },
          ]}
          onSubmit={handleSave}
          onCancel={handleCloseModal}
          initialValues={editMode ? newCategory : { name: '', logoCategory: '' }}
          title={editMode ? 'Update Category' : 'Create Category'}
          submitButtonLabel={editMode ? 'Update' : 'Create'}
        />
      )}
    </div>
  );
};

export default ProductCategoriesPage;
