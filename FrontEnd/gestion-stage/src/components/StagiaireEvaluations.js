// src/components/StagiaireEvaluations.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import DetailedEvaluation from './DetailedEvaluation';

const StagiaireEvaluations = () => {
  const { currentUser } = useAuth();
  const [periodes, setPeriodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState({});
  const [selectedPeriodeId, setSelectedPeriodeId] = useState(null);

  useEffect(() => {
    const fetchPeriodes = async () => {
      if (!currentUser || !currentUser.username) {
        setLoading(false);
        setDebug(prev => ({ ...prev, error: "Utilisateur non connecté ou sans username" }));
        return;
      }

      try {
        // Étape 1: Récupérer les périodes
        setDebug(prev => ({ ...prev, step: "Récupération des périodes", user: currentUser.username }));
        
        const periodesResponse = await axios.get('http://localhost:8080/api/periodes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        setDebug(prev => ({ ...prev, periodesResponse: periodesResponse.status }));

        // Étape 2: Filtrer les périodes pour ce stagiaire
        const stagiairePeriodesData = periodesResponse.data.filter(
          periode => periode.stagiaire.cin === currentUser.username
        );
        
        setDebug(prev => ({ 
          ...prev, 
          periodesCount: periodesResponse.data.length,
          stagiairePeriodesCount: stagiairePeriodesData.length
        }));

        setPeriodes(stagiairePeriodesData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des périodes:", err);
        setDebug(prev => ({ 
          ...prev, 
          errorStep: "Récupération des périodes", 
          errorMessage: err.message,
          errorStatus: err.response?.status,
          errorData: err.response?.data
        }));
        setError("Impossible de charger vos périodes de stage. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    };

    fetchPeriodes();
  }, [currentUser]);

  const openDetailedEvaluation = (periodeId) => {
    setSelectedPeriodeId(periodeId);
  };

  const closeDetailedEvaluation = () => {
    setSelectedPeriodeId(null);
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
            {/* Afficher les informations de débogage en développement */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2 text-xs text-gray-500">
                <summary>Détails de débogage</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(debug, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (periodes.length === 0) {
    return (
      <div className="bg-yellow-50 rounded-xl p-8 text-center">
        <i className="bi bi-clipboard-x text-yellow-400 text-4xl mb-3"></i>
        <p className="text-yellow-700">Aucune période de stage n'a été trouvée pour votre compte.</p>
      </div>
    );
  }

  return (
    <div>
      {periodes.map((periode, index) => (
        <div key={index} className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {periode.stage.entreprise}
              </h3>
              <div className="text-indigo-100 text-sm">
                {new Date(periode.dateDebut).toLocaleDateString()} au {new Date(periode.dateFin).toLocaleDateString()}
              </div>
            </div>
            <p className="text-indigo-100 text-sm mt-1">
              Tuteur: {periode.tuteur.prenom} {periode.tuteur.nom}
            </p>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Informations du stage</h4>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-2">Description</h5>
              <p className="text-gray-700">{periode.stage.description}</p>
              
              <h5 className="font-medium text-gray-800 mt-4 mb-2">Objectifs</h5>
              <p className="text-gray-700">{periode.stage.objectif}</p>
            </div>
            
            <div className="mt-4 text-center">
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                onClick={() => openDetailedEvaluation(periode.id)}
              >
                Voir les évaluations détaillées
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Fenêtre modale d'évaluation détaillée */}
      {selectedPeriodeId && (
        <DetailedEvaluation 
          periodeId={selectedPeriodeId} 
          onClose={closeDetailedEvaluation} 
        />
      )}
    </div>
  );
};

export default StagiaireEvaluations;