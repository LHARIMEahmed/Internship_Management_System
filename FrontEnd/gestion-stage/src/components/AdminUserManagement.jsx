import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AdminUserManagement() {
    // États pour les listes d'utilisateurs
    const [stagiaires, setStagiaires] = useState([]);
    const [tuteurs, setTuteurs] = useState([]);
    const [admins, setAdmins] = useState([]);
    
    // États pour la recherche et le filtrage
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTab, setCurrentTab] = useState('stagiaires');
    
    // États pour la modal de création/édition
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' ou 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    
    // État du formulaire
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nom: '',
        prenom: '',
        email: '',
        role: 'ROLE_STAGIAIRE',
        institution: '',
        entreprise: '',
        service: ''
    });
    
    // Message de notification
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    
    // État de chargement
    const [isLoading, setIsLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState(null);
    
    // Utiliser le hook d'authentification
    const { currentUser, hasRole } = useAuth();
    const navigate = useNavigate();
    
    // Vérifier l'authentification au chargement
    useEffect(() => {
        // Vérifier si l'utilisateur est authentifié et a le rôle admin
        if (!currentUser) {
            showNotification("Vous devez être connecté pour accéder à cette page", 'error');
            navigate('/login');
            return;
        }
        
        if (!hasRole('ROLE_ADMIN')) {
            showNotification("Vous n'avez pas les permissions nécessaires", 'error');
            navigate('/unauthorized');
            return;
        }
        
        loadUsers();
    }, [currentUser, hasRole, navigate]);
    
    const loadUsers = async () => {
        setIsLoading(true);
        
        // Utiliser le token du contexte d'authentification
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.error("Aucun token d'authentification trouvé");
            showNotification("Aucun token d'authentification trouvé. Veuillez vous reconnecter.", 'error');
            setIsLoading(false);
            return;
        }
        
        try {
            console.log("Tentative de chargement des utilisateurs...");
            console.log("Token (partiel):", token ? `${token.substring(0, 15)}...` : "absent");
            
            // Utiliser séquentiellement les requêtes pour mieux identifier le problème
            console.log("Chargement des stagiaires...");
            const stagiaireRes = await axios.get('http://localhost:8080/admin/stagiaires', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Stagiaires reçus:", stagiaireRes.data);
            setStagiaires(stagiaireRes.data || []);
            
            console.log("Chargement des tuteurs...");
            const tuteurRes = await axios.get('http://localhost:8080/admin/tuteurs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Tuteurs reçus:", tuteurRes.data);
            setTuteurs(tuteurRes.data || []);
            
            // Cette requête est potentiellement problématique
            console.log("Chargement des administrateurs...");
            const adminRes = await axios.get('http://localhost:8080/admin/admins', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Administrateurs reçus (brut):", adminRes);
            console.log("Administrateurs reçus (data):", adminRes.data);
            setAdmins(adminRes.data || []);
            
            // Vérification après mise à jour
            setTimeout(() => {
                console.log("État admins après setState:", admins);
            }, 100);
            
            setIsLoading(false);
            
            // Si toutes les listes sont vides, informer l'utilisateur mais sans erreur
            if (
                (!stagiaireRes.data || stagiaireRes.data.length === 0) &&
                (!tuteurRes.data || tuteurRes.data.length === 0) &&
                (!adminRes.data || adminRes.data.length === 0)
            ) {
                showNotification('Aucun utilisateur trouvé dans le système', 'info');
            }
            
        } catch (error) {
            console.error("Erreur détaillée:", error);
            
            // Stocker des informations de débogage pour affichage
            setDebugInfo({
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            
            // Messages d'erreur adaptés aux situations courantes
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    showNotification("Accès non autorisé. Vérifiez que vous avez les droits d'administrateur.", 'error');
                } else if (error.response.status === 404) {
                    showNotification("API introuvable. Vérifiez la configuration du serveur.", 'error');
                } else {
                    showNotification(`Erreur serveur: ${error.response.status} ${error.response.statusText}`, 'error');
                }
            } else if (error.request) {
                showNotification("Impossible de contacter le serveur. Vérifiez qu'il est bien démarré.", 'error');
            } else {
                showNotification(`Erreur lors du chargement: ${error.message}`, 'error');
            }
            
            setIsLoading(false);
        }
    };
    
    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        setSearchTerm('');
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const openCreateModal = (role) => {
        setFormData({
            username: '',
            password: '',
            nom: '',
            prenom: '',
            email: '',
            role: role,
            institution: '',
            entreprise: '',
            service: ''
        });
        setModalMode('create');
        setShowModal(true);
    };
    
    const openEditModal = (user, role) => {
        const userData = {
            username: user.cin,
            password: '', // Ne pas envoyer le mot de passe pour des raisons de sécurité
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: role,
            institution: role === 'ROLE_STAGIAIRE' ? user.institution : '',
            entreprise: role === 'ROLE_TUTEUR' ? user.entreprise : '',
            service: role === 'ROLE_ADMIN' ? user.service : ''
        };
        
        setFormData(userData);
        setSelectedUser(user);
        setModalMode('edit');
        setShowModal(true);
    };
    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Vérifier si le mot de passe est vide lors de la création
        if (modalMode === 'create' && (!formData.password || formData.password.trim() === '')) {
            showNotification('Le mot de passe ne peut pas être vide', 'error');
            return;
        }
        
        // Créer une copie des données pour éviter de modifier l'état directement
        const dataToSend = {...formData};
        
        // Si mode édition et mot de passe vide, supprimer le champ password
        if (modalMode === 'edit' && (!dataToSend.password || dataToSend.password.trim() === '')) {
            delete dataToSend.password;
            console.log('Mot de passe vide en édition - champ supprimé');
        } else {
            console.log('Mot de passe présent - longueur:', dataToSend.password.length);
        }
        
        try {
            // Utiliser le token du contexte d'authentification
            const token = localStorage.getItem('authToken');
            
            console.log('Envoi des données:', {
                ...dataToSend,
                password: dataToSend.password ? '[MASQUÉ]' : 'non envoyé',
                role: dataToSend.role
            });
            
            if (modalMode === 'create') {
                console.log('Création d\'un utilisateur avec rôle:', dataToSend.role);
                const response = await axios.post('http://localhost:8080/auth/register', dataToSend, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Réponse serveur:', response.data);
                showNotification('Utilisateur créé avec succès', 'success');
            } else {
                console.log('Mise à jour d\'un utilisateur avec rôle:', dataToSend.role);
                const response = await axios.put(`http://localhost:8080/admin/utilisateurs/${dataToSend.username}`, dataToSend, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Réponse serveur:', response.data);
                showNotification('Utilisateur modifié avec succès', 'success');
            }
            
            setShowModal(false);
            loadUsers();
        } catch (error) {
            console.error("Erreur détaillée:", error);
            
            if (error.response) {
                showNotification(`Erreur: ${error.response.data || error.response.statusText}`, 'error');
            } else {
                showNotification(`Erreur: ${error.message}`, 'error');
            }
        }
    };
    
    const handleDeleteUser = async (username) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            try {
                // Utiliser le token du contexte d'authentification
                const token = localStorage.getItem('authToken');
                
                await axios.delete(`http://localhost:8080/admin/utilisateurs/${username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showNotification('Utilisateur supprimé avec succès', 'success');
                loadUsers();
            } catch (error) {
                console.error("Erreur lors de la suppression:", error.response?.data || error.message);
                showNotification(`Erreur lors de la suppression: ${error.response?.data || error.message}`, 'error');
            }
        }
    };
    
    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000);
    };
    
    // Filtrer les utilisateurs en fonction du terme de recherche
    const filterUsers = (users) => {
        if (!searchTerm) return users;
        
        return users.filter(user => 
            user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.cin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };
    
    // Rendu des tableaux d'utilisateurs
    const renderUserTable = (users, role) => {
        const filteredUsers = filterUsers(users || []);
        
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-8">
                    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2 text-gray-600">Chargement en cours...</span>
                </div>
            );
        }
        
        return (
            <div>
                <div className="flex flex-col md:flex-row justify-between mb-3">
                    <button 
                        onClick={() => openCreateModal(role)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center mb-3 md:mb-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Ajouter {role === 'ROLE_STAGIAIRE' ? 'un stagiaire' : 
                                role === 'ROLE_TUTEUR' ? 'un tuteur' : 'un admin'}
                    </button>
                    
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
                
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    {role === 'ROLE_STAGIAIRE' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>}
                                    {role === 'ROLE_TUTEUR' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>}
                                    {role === 'ROLE_ADMIN' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user.cin} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{user.cin}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.nom}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.prenom}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                            {role === 'ROLE_STAGIAIRE' && <td className="px-6 py-4 whitespace-nowrap">{user.institution}</td>}
                                            {role === 'ROLE_TUTEUR' && <td className="px-6 py-4 whitespace-nowrap">{user.entreprise}</td>}
                                            {role === 'ROLE_ADMIN' && <td className="px-6 py-4 whitespace-nowrap">{user.service}</td>}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button 
                                                    onClick={() => openEditModal(user, role)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(user.cin)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={role === 'ROLE_STAGIAIRE' ? 6 : 
                                                   role === 'ROLE_TUTEUR' ? 6 : 6} 
                                            className="px-6 py-4 text-center text-sm text-gray-500">
                                            Aucun utilisateur trouvé
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="py-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Gestion des Utilisateurs
                </h2>
                <div className="h-1 w-20 bg-indigo-600 mt-2"></div>
            </div>
            
            {/* Informations de débogage (pour le développement) */}
            {debugInfo && (
                <div className="mb-4 p-4 rounded-lg bg-gray-100 border border-gray-300 text-sm font-mono">
                    <h3 className="font-semibold mb-2">Informations de débogage:</h3>
                    <p>Message: {debugInfo.message}</p>
                    {debugInfo.status && <p>Statut: {debugInfo.status}</p>}
                    {debugInfo.data && <p>Données: {JSON.stringify(debugInfo.data)}</p>}
                    <button 
                        onClick={() => setDebugInfo(null)}
                        className="mt-2 text-indigo-600 hover:text-indigo-800"
                    >
                        Masquer
                    </button>
                </div>
            )}
            
            {notification.show && (
                <div className={`mb-4 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 
                                                         notification.type === 'info' ? 'bg-blue-100 text-blue-800' :
                                                         'bg-red-100 text-red-800'}`}>
                    {notification.message}
                </div>
            )}
            
            {/* Bouton pour réessayer de charger les données */}
            <div className="mb-4">
                <button 
                    onClick={loadUsers}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Actualiser les données
                </button>
            </div>
            
            <div className="mb-6">
                <nav className="flex border-b border-gray-200">
                    <button
                        className={`py-4 px-6 font-medium text-sm ${currentTab === 'stagiaires' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleTabChange('stagiaires')}
                    >
                        Stagiaires ({stagiaires?.length || 0})
                    </button>
                    <button
                        className={`py-4 px-6 font-medium text-sm ${currentTab === 'tuteurs' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleTabChange('tuteurs')}
                    >
                        Tuteurs ({tuteurs?.length || 0})
                    </button>
                    <button
                        className={`py-4 px-6 font-medium text-sm ${currentTab === 'admins' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleTabChange('admins')}
                    >
                        Administrateurs ({admins?.length || 0})
                    </button>
                </nav>
            </div>
            
            <div>
                {currentTab === 'stagiaires' && renderUserTable(stagiaires, 'ROLE_STAGIAIRE')}
                {currentTab === 'tuteurs' && renderUserTable(tuteurs, 'ROLE_TUTEUR')}
                {currentTab === 'admins' && renderUserTable(admins, 'ROLE_ADMIN')}
            </div>
            
            {/* Modal pour créer/éditer un utilisateur */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
                            <h3 className="text-lg font-medium">
                                {modalMode === 'create' ? 'Ajouter un utilisateur' : 'Modifier un utilisateur'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white hover:text-gray-200 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleFormSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                            disabled={modalMode === 'edit'}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {modalMode === 'create' ? 'Mot de passe' : 'Nouveau mot de passe (laissez vide pour ne pas changer)'}
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required={modalMode === 'create'}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                        <input
                                            type="text"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                        <input
                                            type="text"
                                            name="prenom"
                                            value={formData.prenom}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="ROLE_STAGIAIRE">Stagiaire</option>
                                        <option value="ROLE_TUTEUR">Tuteur</option>
                                        <option value="ROLE_ADMIN">Administrateur</option>
                                    </select>
                                </div>
                                
                                {formData.role === 'ROLE_STAGIAIRE' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                                        <input
                                            type="text"
                                            name="institution"
                                            value={formData.institution}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                )}
                                
                                {formData.role === 'ROLE_TUTEUR' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                                        <input
                                            type="text"
                                            name="entreprise"
                                            value={formData.entreprise}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                )}
                                
                                {formData.role === 'ROLE_ADMIN' && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                                        <input
                                            type="text"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                )}
                                
                                <div className="flex justify-end mt-6 space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
                                    >
                                        {modalMode === 'create' ? 'Créer' : 'Enregistrer les modifications'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUserManagement;