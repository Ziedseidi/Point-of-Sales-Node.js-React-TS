import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DynamicForm from '../../components/forms/DynamicForm';
import SubmitBtn from '../../components/forms/SubmitBtn';

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fields = [
        { id: 'newPassword', label: 'New Password', required: true, type: 'password' },
        { id: 'confirmPassword', label: 'Confirm Password', required: true, type: 'password' },
    ];

    const onSubmit = async (data: any) => {
        try {
            if (!token) {
                throw new Error('Token is missing');
            }

            const response = await fetch(`http://localhost:4000/api/password/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword: data.newPassword, confirmPassword: data.confirmPassword }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to reset password');
            }

            setMessage('Password has been reset successfully');
            setErrorMessage(null);
        } catch (error: any) {
            console.error('Error:', error);
            setMessage(null);
            setErrorMessage(error.message || 'Failed to reset password');
        }
    };

    return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 md:p-8">
                    <h1 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                        Reset Your Password
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                        <DynamicForm
                            fields={fields}
                            register={register}
                            errors={errors}
                              
                            submitButtonText="" 
                            layout="stacked"
                        />
                        {message && <p className="text-green-600 dark:text-green-400 text-xs font-medium">{message}</p>}
                        {errorMessage && <p className="text-red-600 dark:text-red-400 text-xs font-medium">{errorMessage}</p>}
                        <SubmitBtn buttonText="Reset password" />
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
