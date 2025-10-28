// src/pages/StagiaireDashboard.js - Modifié pour afficher toutes les périodes
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import StagiaireEvaluations from '../components/StagiaireEvaluations';

const StagiaireDashboard = () => {
  const { currentUser } = useAuth();
  const [periodesData, setPeriodesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour récupérer les données de périodes de stage du stagiaire connecté
    const fetchPeriodesData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Récupérer toutes les périodes
        const response = await axios.get('http://localhost:8080/api/periodes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        // Filtrer les périodes qui correspondent au stagiaire connecté (si le CIN/username correspond)
        const stagiairePeriodesData = response.data.filter(
          periode => periode.stagiaire.cin === currentUser.username
        );
        
        // Trier les périodes par date de début (la plus récente en premier)
        const periodesSorted = stagiairePeriodesData.sort(
          (a, b) => new Date(b.dateDebut) - new Date(a.dateDebut)
        );
        
        setPeriodesData(periodesSorted);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des données de périodes:", err);
        setError("Impossible de charger les informations de vos stages. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    };

    fetchPeriodesData();
  }, [currentUser]);

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
                {currentUser.prenom?.charAt(0) || currentUser.nom?.charAt(0) || 'S'}
              </span>
            </div>
            
            {/* Informations de base */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">
                {currentUser.prenom} {currentUser.nom}
              </h1>
              <p className="text-indigo-100 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-700 bg-opacity-50 text-white">
                  Stagiaire
                </span>
                {currentUser.institution && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-700 bg-opacity-50 text-white ml-2">
                    {currentUser.institution}
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
        
        {/* Contenu principal */}
        <div className="p-6 md:p-8">
          {periodesData.length === 0 ? (
            <div className="bg-yellow-50 p-6 rounded-xl mb-8">
              <div className="flex items-center">
                <i className="bi bi-info-circle text-yellow-500 text-2xl mr-4"></i>
                <p className="text-yellow-700">
                  Aucune période de stage n'est actuellement associée à votre compte. 
                  Veuillez contacter votre administration pour plus d'informations.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Afficher toutes les périodes de stage */}
              {periodesData.map((periodeData, index) => (
                <div key={periodeData.id} className="mb-16">
                  {/* En-tête du stage (entreprise et dates) */}
                  <div className="bg-indigo-600 text-white rounded-t-xl py-4 px-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <h2 className="text-2xl font-bold">{periodeData.stage.entreprise}</h2>
                      <div className="mt-2 md:mt-0 text-sm md:text-base">
                        {new Date(periodeData.dateDebut).toLocaleDateString()} au {new Date(periodeData.dateFin).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Section d'informations du stage */}
                  <div className="mb-8 bg-white border border-gray-200 border-t-0 rounded-b-xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <i className="bi bi-briefcase mr-2 text-indigo-600"></i>
                      Informations du stage
                    </h2>
                    <div className="bg-indigo-50 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Entreprise</p>
                          <p className="font-medium text-gray-900">{periodeData.stage.entreprise}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date de début</p>
                          <p className="font-medium text-gray-900">{new Date(periodeData.dateDebut).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date de fin</p>
                          <p className="font-medium text-gray-900">{new Date(periodeData.dateFin).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Durée</p>
                          <p className="font-medium text-gray-900">
                            {Math.ceil((new Date(periodeData.dateFin) - new Date(periodeData.dateDebut)) / (1000 * 60 * 60 * 24 * 30))} mois
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-indigo-100">
                        <h3 className="font-semibold text-gray-800 mb-3">Description du stage</h3>
                        <p className="text-gray-700">{periodeData.stage.description}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Objectifs</h3>
                        <p className="text-gray-700">{periodeData.stage.objectif}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section d'informations du tuteur */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <i className="bi bi-person-check mr-2 text-indigo-600"></i>
                      Tuteur
                    </h2>
                    
                    <div className="bg-blue-50 rounded-xl p-6">
                      <div className="flex flex-col md:flex-row items-center md:items-start">
                        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                          <span className="text-blue-700 text-xl font-bold">
                            {periodeData.tuteur.prenom?.charAt(0)}{periodeData.tuteur.nom?.charAt(0)}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {periodeData.tuteur.prenom} {periodeData.tuteur.nom}
                          </h3>
                          
                          <div className="mt-3 space-y-2">
                            <p className="text-gray-700 flex items-center">
                              <i className="bi bi-envelope text-blue-500 mr-2"></i>
                              {periodeData.tuteur.email}
                            </p>
                            <p className="text-gray-700 flex items-center">
                              <i className="bi bi-building text-blue-500 mr-2"></i>
                              {periodeData.tuteur.entreprise}
                            </p>
                            {periodeData.tuteur.cin && (
                              <p className="text-gray-700 flex items-center">
                                <i className="bi bi-person-badge text-blue-500 mr-2"></i>
                                CIN: {periodeData.tuteur.cin}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section progression et statut */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <i className="bi bi-graph-up mr-2 text-indigo-600"></i>
                      Progression du stage
                    </h2>
                    
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                      {(() => {
                        const now = new Date();
                        const dateDebut = new Date(periodeData.dateDebut);
                        const dateFin = new Date(periodeData.dateFin);
                        const totalDuration = dateFin - dateDebut;
                        const currentProgress = now - dateDebut;
                        const progressPercentage = Math.min(100, Math.max(0, (currentProgress / totalDuration) * 100));
                        
                        let statusText = "";
                        let statusColorClass = "";
                        
                        if (now < dateDebut) {
                          statusText = "À venir";
                          statusColorClass = "bg-yellow-500";
                        } else if (now > dateFin) {
                          statusText = "Terminé";
                          statusColorClass = "bg-green-500";
                        } else {
                          statusText = "En cours";
                          statusColorClass = "bg-blue-500";
                        }
                        
                        return (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-700 font-medium">Progression</span>
                              <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                              <div 
                                className={`h-2.5 rounded-full ${statusColorClass}`} 
                                style={{width: `${progressPercentage}%`}}
                              ></div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div>Début: {dateDebut.toLocaleDateString()}</div>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColorClass}`}>
                                {statusText}
                              </div>
                              <div>Fin: {dateFin.toLocaleDateString()}</div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex flex-col md:flex-row md:justify-between">
                                <div className="mb-4 md:mb-0">
                                  <p className="text-sm text-gray-500 mb-1">Jours écoulés</p>
                                  <p className="font-medium">{Math.max(0, Math.ceil(currentProgress / (1000 * 60 * 60 * 24)))} jours</p>
                                </div>
                                <div className="mb-4 md:mb-0">
                                  <p className="text-sm text-gray-500 mb-1">Jours restants</p>
                                  <p className="font-medium">{Math.max(0, Math.ceil((dateFin - Math.max(now, dateDebut)) / (1000 * 60 * 60 * 24)))} jours</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Durée totale</p>
                                  <p className="font-medium">{Math.ceil(totalDuration / (1000 * 60 * 60 * 24))} jours</p>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {/* Séparateur entre les périodes */}
                  {index < periodesData.length - 1 && (
                    <div className="border-b-4 border-dotted border-gray-200 my-10"></div>
                  )}
                </div>
              ))}
            </>
          )}
          
          {/* Section des évaluations */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="bi bi-star mr-2 text-indigo-600"></i>
              Évaluations
            </h2>
            
            <StagiaireEvaluations />
          </div>
          
          {/* Section des tâches assignées - Si vous avez des données de tâches à afficher */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="bi bi-list-check mr-2 text-indigo-600"></i>
              Tâches assignées
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <i className="bi bi-clipboard text-gray-400 text-4xl mb-3"></i>
              <p className="text-gray-500">Aucune tâche assignée pour le moment.</p>
            </div>
          </div>
        </div>
        
        {/* Bande décorative inférieure */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </div>
    </div>
  );
};

export default StagiaireDashboard;