import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import validator from 'validator';
import DynamicForm from '../../../components/forms/DynamicForm';
import SubmitBtn from '../../../components/forms/SubmitBtn';

interface FormData {
  name: string;
  description: string;
}

const AddRole = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();
  const [error, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fields = [
    { id: 'name', label: 'Role Name', required: true },
    { id: 'description', label: 'Description', required: true },
  ];

  const validateInput = (data: FormData) => {
    if (validator.isEmpty(data.name)) {
      setError("name", { type: "manual", message: "Role name is required" });
    }
    if (validator.isEmpty(data.description)) {
      setError("description", { type: "manual", message: "Description is required" });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    validateInput(data);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const token = Cookies.get('token');

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:4000/api/addrole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Add role failed');
      }

      setErrorMessage(null);
      setSuccessMessage('Role added successfully! 👍');

      setTimeout(() => {
        navigate('/Dashboard', { state: { roleName: data.name } });
      }, 5000);

    } catch (error) {
      console.error('Error adding role:', error);
      setErrorMessage('Adding role failed');
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Role</h1>
        {successMessage && (
          <div className="flex flex-col items-center justify-center p-6 mb-6 text-center bg-green-50 border border-green-400 rounded-lg dark:bg-gray-800 dark:border-green-600 animate-bounce">
            <svg
              className="w-16 h-16 text-green-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m-4-4h8"
              />
            </svg>
            <p className="mt-4 text-2xl font-semibold text-green-800 dark:text-green-400">
              {successMessage}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <DynamicForm
            fields={fields}
            register={register}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
            submitButtonText=""
            layout="stacked"
          />
          <SubmitBtn buttonText="Add role" />
        </form>
        {error && (
          <div className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </section>
  );
};

export default AddRole;
