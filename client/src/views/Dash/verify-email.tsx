import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DynamicForm from '../../components/forms/DynamicForm';
import SubmitBtn from '../../components/forms/SubmitBtn';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();  // Get the navigate function

    const fields = [
        { id: 'email', label: 'Email', required: true },
    ];

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch('http://localhost:4000/api/password/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to send reset email');
            }

            setMessage('Password reset email sent');
            navigate('/login');  // Use the navigate function to redirect
        } catch (error: any) {
            console.error('Error:', error);
            setMessage(error.message || 'Failed to send reset email');
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Verify Email
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                            <div>
                                <DynamicForm
                                    fields={fields}
                                    register={register}
                                    errors={errors}
                                    error={message}
                                    submitButtonText="" 
                                    layout="stacked"
                                />
                            </div>
                            {message && <span className="text-green-500">{message}</span>}
                            <SubmitBtn buttonText="Verify Email" />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VerifyEmail;
