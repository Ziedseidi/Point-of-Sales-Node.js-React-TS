import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import DynamicForm from '../../../components/forms/DynamicForm';
import BackButton from '../../../components/forms/BackButton';// Assurez-vous d'utiliser le bon chemin d'importation
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  phone: number;
  dateofbirthday: string;
  country: string;
  city: string;
  address: string;
}



const CreateCustomer: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate= useNavigate();


  const handleCancel = () => {
    reset(); // Reset form fields
  };  

  const fields = [
    { id: 'name', label: 'Name', type: 'text', required: true },
    { id: 'email', label: 'Email', type: 'text', required: true },
    { id: 'phone', label: 'Phone Number', type: 'number', required: true },
    { id: 'dob', label: 'DOB', type: 'date' },
    { id: 'country', label: 'Country', type: 'text', required: true },
    { id: 'city', label: 'City', type: 'text', required: true },
    { id: 'adress', label: 'Address', type: 'text', required: true },
  ];
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/customers/Addcustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Adding customer failed');
      }

      setErrorMessage(null);
      navigate('/dashboard/customers');
    } catch (error) {
      console.error('Error adding customer:', error);
      setErrorMessage('Adding customer failed');
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-6xl mx-auto mt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Create Customer</h2>
        <BackButton className="ml-4" /> 
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <DynamicForm
          fields={fields}
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          layout="grid"
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-white bg-red-600 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;
