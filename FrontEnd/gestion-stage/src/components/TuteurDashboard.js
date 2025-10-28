// src/pages/TuteurDashboard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import TuteurEvaluationViewer from '../components/TuteurEvaluationViewer';

const TuteurDashboard = () => {
  const { currentUser } = useAuth();
  const [stagiairesPeriodes, setStagiairesPeriodes] = useState([]);
  const [stats, setStats] = useState({
    totalStagiaires: 0,
    totalEvaluations: 0,
    stagiairesCourants: 0,
    stagiairesPasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState(null);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Récupérer toutes les périodes
        const periodesResponse = await axios.get('http://localhost:8080/api/periodes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        // Filtrer les périodes où currentUser est le tuteur
        const tuteurPeriodesData = periodesResponse.data.filter(
          periode => periode.tuteur && periode.tuteur.cin === currentUser.username
        );
        
        // Trier les périodes par date de début (la plus récente en premier)
        const periodesSorted = tuteurPeriodesData.sort(
          (a, b) => new Date(b.dateDebut) - new Date(a.dateDebut)
        );
        
        // Récupérer toutes les évaluations
        const appreciationsResponse = await axios.get('http://localhost:8080/api/appreciations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(() => ({ data: [] }));
        
        // Stocker les évaluations
        const appreciationsData = Array.isArray(appreciationsResponse.data) 
          ? appreciationsResponse.data 
          : [];
        
        setEvaluations(appreciationsData);

        // Calculer les statistiques
        const now = new Date();
        const stagiairesCourants = tuteurPeriodesData.filter(
          periode => new Date(periode.dateDebut) <= now && new Date(periode.dateFin) >= now
        ).length;
        
        const stagiairesPasses = tuteurPeriodesData.filter(
          periode => new Date(periode.dateFin) < now
        ).length;
        
        // Compter les évaluations du tuteur
        const evaluationsCount = appreciationsData.filter(a => {
          return tuteurPeriodesData.some(p => p.id === a.periode?.id);
        }).length;

        setStats({
          totalStagiaires: tuteurPeriodesData.length,
          totalEvaluations: evaluationsCount,
          stagiairesCourants,
          stagiairesPasses
        });
        
        setStagiairesPeriodes(periodesSorted);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Impossible de charger vos données. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);
  
  // Fonction pour vérifier si une période a une évaluation
  const hasEvaluation = (periodeId) => {
    return evaluations.some(evaluation => evaluation.periode && evaluation.periode.id === periodeId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="bi bi-exclamation-triangle text-red-500"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="bi bi-exclamation-circle text-yellow-500"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à votre tableau de bord.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Bande décorative supérieure */}
        <div className="h-3 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
        
        {/* En-tête avec informations de base */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-8 px-6 relative">
          {/* Éléments décoratifs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500 opacity-20"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-blue-400 opacity-20"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              <span className="text-white text-3xl font-bold">
                {currentUser.prenom?.charAt(0) || currentUser.nom?.charAt(0) || 'T'}
              </span>
            </div>
            
            {/* Informations de base */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">
                {currentUser.prenom || ''} {currentUser.nom || ''}
              </h1>
              <p className="text-indigo-100 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-700 bg-opacity-50 text-white">
                  Tuteur
                </span>
                {currentUser.entreprise && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-700 bg-opacity-50 text-white ml-2">
                    {currentUser.entreprise}
                  </span>
                )}
              </p>
              <p className="text-indigo-100 mt-2">
                <i className="bi bi-envelope mr-2"></i> {currentUser.email || 'Email non disponible'}
              </p>
              {currentUser.cin && (
                <p className="text-indigo-100 mt-1">
                  <i className="bi bi-person-badge mr-2"></i> CIN: {currentUser.cin}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i className="bi bi-graph-up-arrow mr-2 text-indigo-600"></i>
            Statistiques
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-indigo-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Stagiaires</p>
                  <p className="text-2xl font-semibold mt-1">{stats.totalStagiaires}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-people text-indigo-600 text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stagiaires Actuels</p>
                  <p className="text-2xl font-semibold mt-1">{stats.stagiairesCourants}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-person-check text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stagiaires Passés</p>
                  <p className="text-2xl font-semibold mt-1">{stats.stagiairesPasses}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-person-check-fill text-green-600 text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Évaluations</p>
                  <p className="text-2xl font-semibold mt-1">{stats.totalEvaluations}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-clipboard-check text-purple-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
          
          {/* Liste des stagiaires */}
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <i className="bi bi-people mr-2 text-indigo-600"></i>
            Mes Stagiaires
          </h2>
          
          {stagiairesPeriodes.length === 0 ? (
            <div className="bg-yellow-50 p-6 rounded-xl text-center">
              <i className="bi bi-exclamation-circle text-yellow-500 text-3xl mb-3"></i>
              <p className="text-yellow-700">Vous n'avez aucun stagiaire associé à votre compte.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {stagiairesPeriodes.map((periode) => {
                const now = new Date();
                const dateDebut = periode.dateDebut ? new Date(periode.dateDebut) : null;
                const dateFin = periode.dateFin ? new Date(periode.dateFin) : null;
                let status = 'En attente';
                let statusClass = 'bg-yellow-100 text-yellow-800';
                
                if (dateFin && now > dateFin) {
                  status = 'Terminé';
                  statusClass = 'bg-green-100 text-green-800';
                } else if (dateDebut && now >= dateDebut) {
                  status = 'En cours';
                  statusClass = 'bg-blue-100 text-blue-800';
                }
                
                // Vérification si le stagiaire existe
                const stagiaire = periode.stagiaire || {};
                const stage = periode.stage || {};
                
                return (
                  <div key={periode.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="font-bold text-indigo-700">
                              {stagiaire.prenom?.charAt(0) || ''}{stagiaire.nom?.charAt(0) || ''}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {stagiaire.prenom || ''} {stagiaire.nom || ''}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {stagiaire.email || 'Email non disponible'} • {stagiaire.institution || 'Institution non spécifiée'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Entreprise</p>
                          <p className="font-medium">{stage.entreprise || 'Non spécifiée'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Période</p>
                          <p className="font-medium">
                            {dateDebut ? dateDebut.toLocaleDateString() : 'Non spécifiée'} - 
                            {dateFin ? dateFin.toLocaleDateString() : 'Non spécifiée'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Évaluation</p>
                          <button 
                            className="mt-1 bg-indigo-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-indigo-700 transition"
                            onClick={() => {
                              // Si l'évaluation existe, ouvrir la visionneuse
                              if (hasEvaluation(periode.id)) {
                                setSelectedPeriodeId(periode.id);
                              } else {
                                // Sinon, rediriger vers le formulaire d'évaluation
                                window.location.href = `/evaluation-form?periodeId=${periode.id}`;
                              }
                            }}
                          >
                            {hasEvaluation(periode.id) ? 'Voir l\'évaluation' : 'Évaluer'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Description du stage</p>
                        <p className="text-sm text-gray-700">
                          {stage.description 
                            ? `${stage.description.substring(0, 150)}${stage.description.length > 150 ? '...' : ''}`
                            : 'Aucune description disponible'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Pied de page décoratif */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </div>
      
      {/* Modal d'évaluation détaillée */}
      {selectedPeriodeId && (
        <TuteurEvaluationViewer 
          periodeId={selectedPeriodeId}
          onClose={() => setSelectedPeriodeId(null)}
        />
      )}
    </div>
  );
};

export default TuteurDashboard;