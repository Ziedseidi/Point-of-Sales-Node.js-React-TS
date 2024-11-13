import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import DynamicForm from '../../components/forms/DynamicForm'; // Assurez-vous que le chemin est correct

const Confirmation = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setErrorMessage] = useState<string | null>(null);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const fields = [
        { id: 'confirmationCode', label: 'Confirmation Code', required: true },
    ];

    const onSubmit = async (data: any) => {
        console.log('Submitting confirmation:', { email, confirmationCode: data.confirmationCode });

        try {
            const response = await fetch('http://localhost:4000/api/verify-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, confirmationCode: data.confirmationCode }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Invalid confirmation code');
            }

            setErrorMessage(null);
            const responseData = await response.json();
            console.log('Confirmation successful:', responseData);

            navigate('/login');
        } catch (error: any) {
            console.error('Error during confirmation:', error);
            setErrorMessage(error.message || 'Invalid confirmation code');
        }
    };

    const resendCode = async () => {
        console.log('Resending confirmation code for email:', email);

        try {
            const response = await fetch('http://localhost:4000/api/resend-confirmation-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to resend confirmation code');
            }

            setResendMessage('A new confirmation code has been sent to your email.');
            setErrorMessage(null);
        } catch (error: any) {
            console.error('Error resending confirmation code:', error);
            setResendMessage(null);
            setErrorMessage(error.message || 'Failed to resend confirmation code');
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white text-center mb-6">Enter Confirmation Code</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <DynamicForm
                        fields={fields}
                        register={register}
                        errors={errors}
                        onSubmit={handleSubmit(onSubmit)}
                        
                        layout="stacked"
                    />

                    <button
                        className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-500 w-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-4"
                        onClick={onSubmit}
                    >
                        Submit confirmation Code
                    </button>
                </form>
                
                <button
                    className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-500 w-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-4"
                    onClick={resendCode}
                >
                    Resend Confirmation Code
                </button>
                {resendMessage && <span className="text-green-500 mt-2 block text-center">{resendMessage}</span>}
            </div>
        </section>
    );
};

export default Confirmation;
