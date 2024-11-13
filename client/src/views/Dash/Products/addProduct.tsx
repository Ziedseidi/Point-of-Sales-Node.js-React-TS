import React, { useState, useEffect } from 'react';
import ProductForm from './productForm'; // Import ProductForm
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  code: string;
  brand: string;
  category: string;
  saleUnit: string;
  purchaseUnit: string;
  productUnit: string;
  note: string;
  quantityLimitation: number;
  cost: number;
  price: number;
  supplier: string;
  stockAlert: number;
  orderTax: number;
  taxType: string;
}

const CreateProduct: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (endpoint: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
      }
    };

    fetchData('/api/categories/categories', setCategories);
    fetchData('/api/brands/brands', setBrands);
    fetchData('/api/units/units', setUnits);
    fetchData('/api/suppliers/suppliers', setSuppliers);
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch('/api/products/Addproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to create product');
      } else {
        navigate('/dashboard/products');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setErrorMessage('An error occurred while creating the product');
    }
  };

  const handleCancel = () => {
    reset();
    navigate('/dashboard/products');
  };

  const fields = [
    { id: 'name', label: 'Product Name', type: 'text', required: true },
    { id: 'code', label: 'Product Code', type: 'text', required: true },
    { id: 'category', label: 'Product Category', type: 'select', options: categories.map(c => ({ value: c._id, label: c.name })), required: true },
    { id: 'brand', label: 'Brand', type: 'select', options: brands.map(b => ({ value: b._id, label: b.name })), required: true },
    { id: 'barcodeSymbology', label: 'Barcode Symbology', type: 'select', options: [{ value: 'barcode1', label: 'Barcode 1' }], required: true },
    { id: 'saleUnit', label: 'Sale Unit', type: 'select', options: units.map(u => ({ value: u._id, label: u.name })), required: true },
    { id: 'productUnit', label: 'Product Unit', type: 'select', options: units.map(u => ({ value: u._id, label: u.name })), required: true },
    { id: 'purchaseUnit', label: 'Purchase Unit', type: 'select', options: units.map(u => ({ value: u._id, label: u.name })), required: true },
    { id: 'quantityLimitation', label: 'Quantity Limitation', type: 'number', required: false },
    { id: 'supplier', label: 'Supplier', type: 'select', options: suppliers.map(s => ({ value: s._id, label: s.name })), required: true },
    { id: 'note', label: 'Note', type: 'textarea', required: false },
    { id: 'cost', label: 'Cost', type: 'number', required: true },
    { id: 'price', label: 'Price', type: 'number', required: true },
    { id: 'stockAlert', label: 'Stock Alert', type: 'number', required: true },
    { id: 'orderTax', label: 'Order Tax', type: 'number', required: true },
    { id: 'taxType', label: 'Tax Type', type: 'text', required: true },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <ProductForm
        fields={fields}
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        error={errorMessage}
      />
    </div>
  );
};

export default CreateProduct;
