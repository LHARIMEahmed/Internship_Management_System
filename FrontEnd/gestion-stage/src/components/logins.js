import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error message when user starts typing
        if (errorMessage) setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            
            const userData = await login(formData.username, formData.password);
            
           
            if (userData && userData.role) {
                switch (userData.role) {
                    case 'ROLE_ADMIN':
                        navigate('/admin/dashboard');
                        break;
                    case 'ROLE_TUTEUR':
                        navigate('/tuteur-dashboard');
                        break;
                    case 'ROLE_STAGIAIRE':
                        navigate('/stagiaire-dashboard');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                navigate('/');
            }
            
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.');
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-md">
           
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all">
              
                <div className="h-3 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                
               
                <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 py-12 px-6 text-center">
                   
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500 opacity-20"></div>
                        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-blue-400 opacity-20"></div>
                        <div className="absolute bottom-1/4 right-1/3 w-6 h-6 rounded-full bg-white opacity-10"></div>
                        <div className="absolute top-1/3 left-1/4 w-10 h-10 rounded-full bg-white opacity-10"></div>
                    </div>
                    
                  
                    <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                        <i className="bi bi-person-badge text-white text-2xl"></i>
                    </div>
                    
                  
                    <h2 className="text-3xl font-bold text-white relative">Connexion</h2>
                    <p className="text-indigo-100 mt-2 relative">Accédez à votre espace personnel</p>
                </div>
                
              
                <div className="p-8 max-w-xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Nom d'utilisateur
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="bi bi-person text-gray-400"></i>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition duration-150"
                                    placeholder="Entrez votre nom d'utilisateur"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        
                    
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="bi bi-lock text-gray-400"></i>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition duration-150"
                                    placeholder="Entrez votre mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                       
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-gray-600">
                                    Se souvenir de moi
                                </label>
                            </div>
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition">
                                Mot de passe oublié?
                            </a>
                        </div>

                     
                        {errorMessage && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg" role="alert">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <i className="bi bi-exclamation-triangle text-red-500"></i>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{errorMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                 
                        <button
                            type="submit"
                            className={`w-full flex items-center justify-center px-6 py-3 rounded-xl text-white font-medium text-lg transition duration-150 shadow-lg
                                ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transform hover:-translate-y-px'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-box-arrow-in-right mr-2"></i>
                                    Se connecter
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
             
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-600 mb-4">
                        Vous n'avez pas encore de compte ? Contactez l'administration
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        
                    </div>
                </div>
                
               
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            </div>
            
           
            <p className="mt-6 text-center text-sm text-gray-500">
                Besoin d'aide ? <a href="#" className="text-indigo-600 font-medium hover:text-indigo-500">Contactez le support</a>
            </p>
        </div>
    );
}

export default Login;