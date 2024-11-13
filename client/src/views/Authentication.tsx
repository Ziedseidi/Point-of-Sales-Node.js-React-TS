import  { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../components/forms/DynamicForm';
import SubmitBtn from '../components/forms/SubmitBtn';
import Cookies from 'js-cookie';



const Authentication = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // fields for authntication
    const fields = [
        { id: 'email', label: 'Email ', required: true },
        { id: 'password', label: 'Password', required: true, type: 'password' },
      ];
      // On  submit function
    const onSubmit = async (data: any) => {
        console.log('Données envoyées:', data);
        try {
            const response = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            // check if user is disabled
            const responseData = await response.json();
            if (responseData.message === 'Utilisateur désactivé') {
                setError('Votre compte a été désactivé. Contactez l\'administrateur.');
                return;
            }
            //check if user is inactive
            if (responseData.needsActivation) {
                navigate('/confirmation', { state: { email: data.email } });
                return;
            }

            if (!response.ok) {
                throw new Error(responseData.message || 'Email ou mot de passe incorrect');
            }

            console.log('Connexion réussie:', responseData);

            Cookies.set('token', responseData.token);

            

            navigate('/Dashboard'); 
            
        } catch (error: any) {
            console.error('Erreur lors de la connexion :', error);
            setError(error.message || 'Erreur lors de la connexion');
        }
        

        
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                              Login to your account
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                            <DynamicForm
                                fields={fields}
                                register={register}
                                errors={errors} 
                                layout="stacked"
                                
                            />

                             
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate('/verify-email')}
                                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Forget Password?
                                </button>
                            </div>
                            {error && <span className="text-red-500">{error}</span>}
                            <SubmitBtn buttonText="login" />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Authentication;