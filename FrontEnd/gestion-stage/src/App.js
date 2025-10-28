// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { PrivateRoute, RoleRoute, PublicOnlyRoute } from './components/routes/ProtectedRoutes';
import AdminDashboard from './components/AdminDashboard';
// Components
import Login from './components/logins';

import EvaluationForm from './components/FormEvaluation';
import FormulaireModificationEvaluation from './pages/FormulaireModificationEvaluation'; // Nouveau import pour le formulaire de modification
import Unauthorized from './components/Unauthorized';
import StagiaireDashboard from './components/StagiaireDashboard'; 
import TuteurDashboard from './components/TuteurDashboard'; // Nouveau import
import AdminUserManagement from './components/AdminUserManagement'; // Import du composant d'administration

// Navbar Component - Modernisé
  const NavBar = () => {
  const { currentUser, logout, hasRole } = useAuth();
  const navigate = useNavigate(); // Ajout du hook pour la redirection
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Effet de scroll pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
      
    const toggleMenu = () => setIsOpen(!isOpen);
  
    // Fonction de déconnexion avec redirection
    const handleLogout = () => {
      logout();
      navigate('/'); // Redirection vers la page d'accueil
    };
  
    // Styles communs pour tous les boutons de navigation
    const commonButtonStyle = `
      px-4 py-2 rounded-lg font-medium transition-all duration-200
      ${scrolled 
        ? 'text-indigo-700 hover:bg-indigo-50' 
        : 'text-white hover:bg-white/10'
      }
    `;
  
    // Style spécifique pour les boutons d'action (comme Déconnexion)
    const actionButtonStyle = `
      px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-200
      ${scrolled 
        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
        : 'bg-white/20 text-white hover:bg-white/30'
      }
    `;
  
    // Style pour les liens de navigation (comme Accueil, Tableau de bord)
    const navLinkStyle = `
      px-4 py-2 rounded-lg font-medium transition-all duration-200
      ${scrolled 
        ? 'hover:bg-indigo-50' 
        : 'hover:bg-white/20 bg-white/10'
      }
    `;

  

  return (
    <nav className={`${scrolled ? 'bg-white text-indigo-700 shadow-lg' : 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white'} transition-all duration-300 sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className={`font-bold text-xl flex items-center group transition-all duration-300`}>
          <div className={`mr-3 p-2 rounded-full ${scrolled ? 'bg-indigo-100' : 'bg-white/20'} group-hover:rotate-12 transition-all duration-300`}>
            <i className={`bi bi-mortarboard-fill ${scrolled ? 'text-indigo-600' : 'text-white'}`}></i>
          </div>
          <span className="font-sans tracking-tight">GesStages</span>
        </Link>

        <button
          className="lg:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile menu */}
        <div className={`lg:hidden fixed inset-0 z-40 bg-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out pt-20`}>
          <div className="flex flex-col space-y-4 p-5">
            <Link 
              to="/" 
              className="text-indigo-700 hover:text-indigo-900 font-medium py-3 px-4 rounded-lg hover:bg-indigo-50 transition"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>

            {!currentUser && (
              <Link 
                to="/login" 
                className="text-indigo-700 hover:text-indigo-900 font-medium py-3 px-4 rounded-lg hover:bg-indigo-50 transition"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
            )}

            {currentUser && hasRole('ROLE_TUTEUR') && (
              <>
                <Link 
                  to="/tuteur-dashboard" 
                  className="text-indigo-700 hover:text-indigo-900 font-medium py-3 px-4 rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Mon tableau de bord
                </Link>
                <Link 
                  to="/evaluation-form" 
                  className="text-indigo-700 hover:text-indigo-900 font-medium py-3 px-4 rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Formulaire d'évaluation
                </Link>
              </>
            )}

            {currentUser && hasRole('ROLE_STAGIAIRE') && (
              <Link 
                to="/stagiaire-dashboard" 
                className="text-indigo-700 hover:text-indigo-900 font-medium py-3 px-4 rounded-lg hover:bg-indigo-50 transition"
                onClick={() => setIsOpen(false)}
              >
                Mon tableau de bord
              </Link>
            )}
            
            {currentUser && hasRole('ROLE_ADMIN') && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className="text-indigo-700 hover:text-indigo-900 font-medium py-3 px-4 rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Tableau de bord
                </Link>
                
                <Link 
                  to="/admin/users" 
                  className="text-indigo-700 hover:text-indigo-900 font-medium py-3 px-4 rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Gestion des utilisateurs
                </Link>
                
              </>
            )}

            {currentUser && (
              <div className="flex flex-col space-y-3 border-t pt-5 mt-5 border-indigo-100">
                <div className="flex items-center px-4 py-2 bg-indigo-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold mr-3">
                    {currentUser.prenom?.charAt(0)}{currentUser.nom?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-indigo-900 font-medium">
                      {currentUser.prenom} {currentUser.nom}
                    </p>
                    <p className="text-indigo-500 text-sm">
                      {hasRole('ROLE_ADMIN') ? 'Administrateur' : hasRole('ROLE_TUTEUR') ? 'Tuteur' : 'Stagiaire'}
                    </p>
                  </div>
                </div>
                {/* Bouton de déconnexion mobile modifié */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="bg-red-100 text-red-600 px-4 py-3 rounded-lg hover:bg-red-200 text-sm font-medium flex items-center justify-center transition"
                >
                  <i className="bi bi-box-arrow-right mr-2"></i>
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop menu - MODIFIÉ AVEC LES NOUVEAUX STYLES */}
        <div className="hidden lg:flex items-center space-x-1">
          {/* Lien Accueil */}
          <Link to="/" className={navLinkStyle}>
            Accueil
          </Link>

          {/* Lien de connexion pour les utilisateurs non connectés */}
          {!currentUser && (
            <Link to="/login" className={navLinkStyle}>
              Connexion
            </Link>
          )}

          {/* Liens pour les tuteurs */}
          {currentUser && hasRole('ROLE_TUTEUR') && (
            <>
              <Link to="/tuteur-dashboard" className={navLinkStyle}>
                Mon tableau de bord
              </Link>
              <Link to="/evaluation-form" className={navLinkStyle}>
                Formulaire d'évaluation
              </Link>
            </>
          )}

          {/* Liens pour les stagiaires */}
          {currentUser && hasRole('ROLE_STAGIAIRE') && (
            <Link to="/stagiaire-dashboard" className={navLinkStyle}>
              Mon tableau de bord
            </Link>
          )}
          
          {/* Liens pour les administrateurs */}
          {currentUser && hasRole('ROLE_ADMIN') && (
            <>
              <Link to="/admin/dashboard" className={navLinkStyle}>
                Tableau de bord
              </Link>
              <Link to="/admin/users" className={navLinkStyle}>
                Gestion des utilisateurs
              </Link>
              
            </>
          )}

          {/* Bouton de déconnexion pour les utilisateurs connectés */}
          {currentUser && (
            <button
              onClick={handleLogout}
              className={actionButtonStyle}
            >
              <i className="bi bi-box-arrow-right mr-2"></i>
              Déconnexion
            </button>
          )}

          {/* Menu utilisateur (avatar et nom) */}
          {currentUser && (
            <div className="flex items-center ml-6 pl-6 border-l border-indigo-300/30">
              <div className={`relative group cursor-pointer flex items-center ${scrolled ? 'text-indigo-700' : 'text-white'}`}>
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-2 shadow-sm">
                  <span className="font-medium">
                    {currentUser.prenom?.charAt(0)}{currentUser.nom?.charAt(0)}
                  </span>
                </div>
                <span className="font-medium text-sm mr-1">
                  {currentUser.prenom}
                </span>
                
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{currentUser.prenom} {currentUser.nom}</p>
                    <p className="text-sm text-gray-500">
                      {hasRole('ROLE_ADMIN') ? 'Administrateur' : hasRole('ROLE_TUTEUR') ? 'Tuteur' : 'Stagiaire'}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition flex items-center"
                    >
                      <i className="bi bi-box-arrow-right mr-2"></i>
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// App container with Auth wrapper
function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="container mx-auto flex-grow px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Routes only for non-authenticated users */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected routes for tuteurs */}
          <Route element={<RoleRoute requiredRole="ROLE_TUTEUR" />}>
            <Route path="/evaluation-form" element={<EvaluationForm />} />
            <Route path="/tuteur-dashboard" element={<TuteurDashboard />} />
            {/* Nouvelle route pour le formulaire de modification d'évaluation */}
            <Route path="/modifier-evaluation/:periodeId" element={<FormulaireModificationEvaluation />} />
          </Route>

          {/* Protected routes for stagiaires */}
          <Route element={<RoleRoute requiredRole="ROLE_STAGIAIRE" />}>
            <Route path="/stagiaire-dashboard" element={<StagiaireDashboard />} />
          </Route>
          
          {/* Protected routes for admins */}
          <Route element={<RoleRoute requiredRole="ROLE_ADMIN" />}>
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="mt-auto">
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 py-12 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-full bg-white/10 mr-3">
                    <i className="bi bi-mortarboard-fill text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold">GesStages</h3>
                </div>
                <p className="text-indigo-200 mb-4">
                  Plateforme de gestion de stages optimisée pour faciliter le suivi et l'évaluation des stagiaires.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
                <div className="space-y-3">
                  <div><Link to="/" className="text-indigo-200 hover:text-white transition">Accueil</Link></div>
                  {/* Afficher le lien Connexion uniquement si l'utilisateur n'est pas connecté */}
                  {!useAuth().currentUser && (
                    <div><Link to="/login" className="text-indigo-200 hover:text-white transition">Connexion</Link></div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <div className="space-y-3">
                <div>n.azzaoui2314@uca.ac.ma</div>
                <div>a.lharime5567@uca.ac.ma</div>
                  <div>+212 6 84 88 58 35</div>
                  <div>+212 7 70 15 03 16</div>
                 
                </div>
              </div>
              
              
            </div>
            
            <div className="border-t border-indigo-800 mt-8 pt-6 text-center text-indigo-300">
              <p>&copy; {new Date().getFullYear()} GesStages. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// HomePage modernisée avec condition pour ne pas afficher "Se connecter" si l'utilisateur est connecté
const HomePage = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="py-12">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-500 mb-20">
        {/* Background patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-indigo-500 opacity-20"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-400 opacity-20"></div>
          <div className="absolute top-1/3 left-1/4 w-12 h-12 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 rounded-full bg-white opacity-10"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-block mb-6 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white">
            <span className="font-medium text-sm flex items-center">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></span>
              Plateforme nouvelle génération
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Simplifiez la gestion<br className="hidden md:block" /> de vos stages
          </h1>
          
          <p className="text-indigo-100 mb-10 max-w-2xl mx-auto text-lg">
            Notre plateforme offre une solution complète pour le suivi des stages, l'évaluation des compétences et la communication entre tuteurs et stagiaires.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Bouton "Se connecter" uniquement si l'utilisateur n'est pas connecté */}
            {!currentUser && (
              <Link to="/login" className="bg-white text-indigo-600 px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-50 transition text-lg font-semibold flex items-center justify-center group">
                Se connecter
                <i className="bi bi-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Fonctionnalités principales</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Notre plateforme offre tous les outils nécessaires pour une gestion efficace des stages
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <i className="bi bi-clipboard-check text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Suivi simplifié</h3>
            <p className="text-gray-600">
              Suivez la progression des stages en temps réel avec des tableaux de bord intuitifs et des rapports personnalisés.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <i className="bi bi-stars text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Évaluation efficace</h3>
            <p className="text-gray-600">
              Utilisez nos formulaires d'évaluation personnalisables pour mesurer les compétences et suivre la progression.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <i className="bi bi-chat-dots text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Communication fluide</h3>
            <p className="text-gray-600">
              Facilitez les échanges entre tuteurs et stagiaires grâce à notre système de messagerie intégré.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-100"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-100"></div>
          
          <div className="relative">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Prêt à optimiser la gestion de vos stages?</h2>
              <p className="text-gray-700 mb-8">
                Rejoignez les centaines d'établissements et d'entreprises qui utilisent déjà notre plateforme pour faciliter la gestion de leurs stages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* N'afficher aucun bouton ici si l'utilisateur est connecté */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// The actual App component wrapped with AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;