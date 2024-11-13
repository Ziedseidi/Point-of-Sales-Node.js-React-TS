import React from 'react';
import ProductTable from '../../../components/forms/TableDynamic';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        Header: 'PRODUCT',
        accessor: 'product',
        Cell: () => (
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            Img
          </div>
        ),
      },
      {
        Header: 'NAME',
        accessor: 'name',
        width: 200,
      },
      {
        Header: 'CODE',
        accessor: 'code',
        Cell: ({ value }: { value: string }) => (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
            {value}
          </span>
        ),
      },
      {
        Header: 'BRAND',
        accessor: 'brand.name', // Access the brand name
      },
      {
        Header: 'PRICE',
        accessor: 'price',
      },
      {
        Header: 'PRODUCT UNIT',
        accessor: 'productUnit.name', // Access the unit name
        Cell: ({ value }: { value: string }) => (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
            {value}
          </span>
        ),
      },
      {
        Header: 'IN STOCK',
        accessor: 'inStock',
      },
      {
        Header: 'CREATED ON',
        accessor: 'creationDate',
        Cell: ({ value }: { value: string }) => (
          <span className="text-center text-blue-500 bg-blue-100 px-2 py-1 rounded">
            {value}
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

  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products/products');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  const handleView = (product: any) => {
    console.log('View', product);
    // Add your view logic here
  };

  const handleUpdate = (product: any) => {
    console.log('Update', product);
    // Add your update logic here
  };

  const handleDelete = async (product: any) => {
    try {
      await fetch(`http://localhost:4000/api/products/Deleteproducts/${product._id}`, {
        method: 'DELETE',
      });
      setData(prevData => prevData.filter(w => w._id !== product._id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCreateProduct = () => {
    navigate('/dashboard/addProduct');
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
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
          </div>
        </div>
        <button
          onClick={handleCreateProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Product
        </button>
      </div>
      <ProductTable columns={columns} data={data} />
    </div>
  );
};

export default ProductsPage;
