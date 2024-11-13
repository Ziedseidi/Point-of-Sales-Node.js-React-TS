import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import DynamicForm from '../../../components/forms/DynamicForm';
import validator from 'validator';
import SubmitBtn from '../../../components/forms/SubmitBtn';

interface FormData {
  userName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  phone: string;
  profileImage?: FileList;
}

const AddUser = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();
  const [error, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // État pour le message de succès
  const navigate = useNavigate();

  const validateInput = (data: FormData) => {
    if (!validator.isEmail(data.email)) {
      setError("email", { type: "manual", message: "Email is not valid" });
    }
    if (!validator.isStrongPassword(data.password)) {
      setError("password", { type: "manual", message: "Password must be strong" });
    }
    if (!validator.isMobilePhone(data.phone, 'any', { strictMode: false })) {
      setError("phone", { type: "manual", message: "Phone number is not valid" });
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

      const formData = new FormData();
      formData.append('userName', data.userName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('dateOfBirth', data.dateOfBirth);
      formData.append('phone', data.phone);

      if (data.profileImage && data.profileImage.length > 0) {
        formData.append('profileImage', data.profileImage[0]);
      }

      const response = await fetch('http://localhost:4000/api/adduser', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Add user failed');
      }

      setErrorMessage(null);

      const responseData = await response.json();
      setSuccessMessage('User added successfully! 👍'); // Mettre à jour le message de succès

      // Redirection après 10 secondes
      setTimeout(() => {
        navigate('/Dashboard', { state: { email: data.email } });
      }, 5000);

    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage('Sign up failed');
    }
  };

  const fields = [
    { id: 'userName', label: 'Username', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
    { id: 'password', label: 'Password', type: 'password', required: true },
    { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
    { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { id: 'profileImage', label: 'Profile Image', type: 'file' }
  ];

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-6">
              Add User
            </h1>
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
                submitButtonText="Add User"
                layout="grid"
              />
              <SubmitBtn buttonText="Add user" />
            </form>
            {error && (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddUser;
