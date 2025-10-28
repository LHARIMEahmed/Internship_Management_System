// src/components/DetailedEvaluation.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EvaluationPdfGenerator from './EvaluationPdfGenerator';

const DetailedEvaluation = ({ periodeId, onClose }) => {
  const [evaluation, setEvaluation] = useState({
    appreciation: null,
    competenceEtudiant: null,
    competenceEntreprise: null,
    competenceScientifique: null,
    competencesSpecifiques: []
  });
  const [periodeData, setPeriodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState({});

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching evaluations for periodeId:", periodeId);
        setDebug(prev => ({ ...prev, periodeId }));

        // Récupérer les données de la période pour le PDF
        const periodePromise = axios.get(`http://localhost:8080/api/periodes/${periodeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(err => {
          console.log('Erreur lors de la récupération des données de période', err);
          return { data: null };
        });

        // Récupérer toutes les données et filtrer
        const appreciationPromise = axios.get(`http://localhost:8080/api/appreciations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(err => {
          console.log('Erreur lors de la récupération des appréciations', err);
          return { data: [] };
        });

        const compEtudiantPromise = axios.get(`http://localhost:8080/api/competences-etudiant`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(err => {
          console.log('Erreur lors de la récupération des compétences étudiant', err);
          return { data: [] };
        });

        const compEntreprisePromise = axios.get(`http://localhost:8080/api/competences-entreprise`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(err => {
          console.log('Erreur lors de la récupération des compétences entreprise', err);
          return { data: [] };
        });

        const compScientifiquePromise = axios.get(`http://localhost:8080/api/competences-scientifiques`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(err => {
          console.log('Erreur lors de la récupération des compétences scientifiques', err);
          return { data: [] };
        });

        const compSpecifiquePromise = axios.get(`http://localhost:8080/api/competences-specifiques`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(err => {
          console.log('Erreur lors de la récupération des compétences spécifiques', err);
          return { data: [] };
        });

        // Attendre toutes les réponses
        const [
          periodeResponse,
          appreciationResponse,
          compEtudiantResponse,
          compEntrepriseResponse,
          compScientifiqueResponse,
          compSpecifiqueResponse
        ] = await Promise.all([
          periodePromise,
          appreciationPromise,
          compEtudiantPromise,
          compEntreprisePromise,
          compScientifiquePromise,
          compSpecifiquePromise
        ]);

        // Stocker les données de la période
        setPeriodeData(periodeResponse.data);

        // Enregistrer les données brutes pour débogage
        setDebug(prev => ({
          ...prev,
          periodeRaw: periodeResponse.data,
          appreciationRaw: appreciationResponse.data,
          compEtudiantRaw: compEtudiantResponse.data,
          compEntrepriseRaw: compEntrepriseResponse.data,
          compScientifiqueRaw: compScientifiqueResponse.data,
          compSpecifiqueRaw: compSpecifiqueResponse.data
        }));

        // Filtrer les données pour cette période spécifique
        const filteredAppreciation = Array.isArray(appreciationResponse.data) ? 
          appreciationResponse.data.find(a => a.periode && a.periode.id === parseInt(periodeId)) : 
          (appreciationResponse.data?.periode?.id === parseInt(periodeId) ? appreciationResponse.data : null);
        
        const filteredCompEtudiant = Array.isArray(compEtudiantResponse.data) ? 
          compEtudiantResponse.data.find(c => c.periode && c.periode.id === parseInt(periodeId)) : 
          (compEtudiantResponse.data?.periode?.id === parseInt(periodeId) ? compEtudiantResponse.data : null);
        
        const filteredCompEntreprise = Array.isArray(compEntrepriseResponse.data) ? 
          compEntrepriseResponse.data.find(c => c.periode && c.periode.id === parseInt(periodeId)) : 
          (compEntrepriseResponse.data?.periode?.id === parseInt(periodeId) ? compEntrepriseResponse.data : null);
        
        const filteredCompScientifique = Array.isArray(compScientifiqueResponse.data) ? 
          compScientifiqueResponse.data.find(c => c.periode && c.periode.id === parseInt(periodeId)) : 
          (compScientifiqueResponse.data?.periode?.id === parseInt(periodeId) ? compScientifiqueResponse.data : null);
        
        const filteredCompSpecifiques = Array.isArray(compSpecifiqueResponse.data) ? 
          compSpecifiqueResponse.data.filter(c => c.periode && c.periode.id === parseInt(periodeId)) : 
          [];

        // Stocker les données filtrées
        setDebug(prev => ({
          ...prev,
          filteredAppreciation,
          filteredCompEtudiant,
          filteredCompEntreprise,
          filteredCompScientifique,
          filteredCompSpecifiques
        }));

        // Mettre à jour l'état
        setEvaluation({
          appreciation: filteredAppreciation,
          competenceEtudiant: filteredCompEtudiant,
          competenceEntreprise: filteredCompEntreprise,
          competenceScientifique: filteredCompScientifique,
          competencesSpecifiques: filteredCompSpecifiques
        });

        console.log("Données d'évaluation filtrées:", {
          appreciation: filteredAppreciation,
          competenceEtudiant: filteredCompEtudiant,
          competenceEntreprise: filteredCompEntreprise,
          competenceScientifique: filteredCompScientifique,
          competencesSpecifiques: filteredCompSpecifiques
        });

      } catch (err) {
        console.error("Erreur lors de la récupération des évaluations:", err);
        setError("Impossible de charger les évaluations détaillées. Veuillez réessayer plus tard.");
        setDebug(prev => ({ ...prev, error: err.message, errorStack: err.stack }));
      } finally {
        setLoading(false);
      }
    };

    if (periodeId) {
      fetchEvaluations();
    }
  }, [periodeId]);

  // Fonctions pour convertir les notes numériques en libellés
  const getImplicationLabel = (value) => {
    const options = [
      { value: 1, label: 'Paresseux' },
      { value: 2, label: 'Le juste nécessaire' },
      { value: 3, label: 'Bonne' },
      { value: 4, label: 'Très forte' },
      { value: 5, label: 'Dépasse ses objectifs' }
    ];
    return options.find(option => option.value === value)?.label || 'Non évalué';
  };

  const getOuvertureLabel = (value) => {
    const options = [
      { value: 1, label: 'Isolé(e) ou en opposition' },
      { value: 2, label: 'Renfermé(e) ou obtus' },
      { value: 3, label: 'Bonne' },
      { value: 4, label: 'Très bonne' },
      { value: 5, label: 'Excellente' }
    ];
    return options.find(option => option.value === value)?.label || 'Non évalué';
  };

  const getQualiteLabel = (value) => {
    const options = [
      { value: 1, label: 'Médiocre' },
      { value: 2, label: 'Acceptable' },
      { value: 3, label: 'Bonne' },
      { value: 4, label: 'Très bonne' },
      { value: 5, label: 'Très professionnelle' }
    ];
    return options.find(option => option.value === value)?.label || 'Non évalué';
  };

  const getNiveauLabel = (value) => {
    const options = [
      { value: 0, label: 'Non applicable' },
      { value: 1, label: 'Débutant' },
      { value: 2, label: 'Autonome' },
      { value: 3, label: 'Autonome +' }
    ];
    return options.find(option => option.value === value)?.label || 'Non évalué';
  };

  const getNiveauClass = (value) => {
    switch (value) {
      case 0: return 'bg-gray-100 text-gray-800';
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNoteClass = (value) => {
    if (value >= 16) return 'bg-green-100 text-green-800';
    if (value >= 14) return 'bg-teal-100 text-teal-800';
    if (value >= 12) return 'bg-blue-100 text-blue-800';
    if (value >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (process.env.NODE_ENV === 'development') {
    console.log("Evaluation state:", evaluation);
    console.log("Debug data:", debug);
  }

  const hasNoEvaluations = !evaluation.appreciation && 
                         !evaluation.competenceEtudiant && 
                         !evaluation.competenceEntreprise && 
                         !evaluation.competenceScientifique && 
                         (evaluation.competencesSpecifiques.length === 0);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Évaluation détaillée</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4">
              <h3 className="font-semibold">Données de débogage:</h3>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto max-h-60 text-xs">
                {JSON.stringify(debug, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (hasNoEvaluations) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Évaluation détaillée</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
            <p className="text-gray-600">Aucune évaluation n'a encore été faite pour cette période de stage.</p>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold">Informations de débogage:</h3>
              <p className="text-sm mb-2">ID de période: {periodeId}</p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Données brutes:</h4>
                  <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-40 text-xs">
                    {JSON.stringify(debug, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium">État d'évaluation:</h4>
                  <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-40 text-xs">
                    {JSON.stringify(evaluation, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Évaluation détaillée</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Bouton de téléchargement PDF */}
        <div className="mb-6 text-right">
          <EvaluationPdfGenerator evaluation={evaluation} periodeData={periodeData} />
        </div>
        {/* Appréciation Globale */}
        {evaluation.appreciation && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Appréciation Globale
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Implication</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${evaluation.appreciation.implication * 20}%`}}></div>
                  </div>
                  <span className="text-sm font-medium">{evaluation.appreciation.implication}/5</span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {getImplicationLabel(evaluation.appreciation.implication)}
                </p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Ouverture aux Autres</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${evaluation.appreciation.ouverture * 20}%`}}></div>
                  </div>
                  <span className="text-sm font-medium">{evaluation.appreciation.ouverture}/5</span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {getOuvertureLabel(evaluation.appreciation.ouverture)}
                </p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Qualité des Productions</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${evaluation.appreciation.qualiteProductions * 20}%`}}></div>
                  </div>
                  <span className="text-sm font-medium">{evaluation.appreciation.qualiteProductions}/5</span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {getQualiteLabel(evaluation.appreciation.qualiteProductions)}
                </p>
              </div>
            </div>

            {evaluation.appreciation.observations && (
              <div className="bg-gray-50 rounded-lg p-4 mt-2">
                <p className="text-sm text-gray-600 mb-1">Observations</p>
                <p className="text-gray-800">{evaluation.appreciation.observations}</p>
              </div>
            )}
          </div>
        )}

        {/* Compétences Individuelles */}
        {evaluation.competenceEtudiant && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Compétences Individuelles
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compétence</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluation.competenceEtudiant.analyseSynthese !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Analyse et Synthèse</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEtudiant.analyseSynthese)}`}>
                          {getNiveauLabel(evaluation.competenceEtudiant.analyseSynthese)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEtudiant.autoEvaluation !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Auto-Évaluation</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEtudiant.autoEvaluation)}`}>
                          {getNiveauLabel(evaluation.competenceEtudiant.autoEvaluation)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEtudiant.contexteInternational !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Contexte International</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEtudiant.contexteInternational)}`}>
                          {getNiveauLabel(evaluation.competenceEtudiant.contexteInternational)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEtudiant.faireAdhererActeurs !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Faire Adhérer les Acteurs</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEtudiant.faireAdhererActeurs)}`}>
                          {getNiveauLabel(evaluation.competenceEtudiant.faireAdhererActeurs)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEtudiant.identifierProblemes !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Identifier les Problèmes</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEtudiant.identifierProblemes)}`}>
                          {getNiveauLabel(evaluation.competenceEtudiant.identifierProblemes)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEtudiant.methodesAxesTravail !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Méthodes et Axes de Travail</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEtudiant.methodesAxesTravail)}`}>
                          {getNiveauLabel(evaluation.competenceEtudiant.methodesAxesTravail)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEtudiant.noteGlobale !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        Note Globale
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNoteClass(evaluation.competenceEtudiant.noteGlobale)}`}>
                          {evaluation.competenceEtudiant.noteGlobale}/20
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compétences de l'Entreprise */}
        {evaluation.competenceEntreprise && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Compétences de l'Entreprise
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compétence</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluation.competenceEntreprise.fonctionnementEntreprise !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Analyser le Fonctionnement de l'Entreprise</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEntreprise.fonctionnementEntreprise)}`}>
                          {getNiveauLabel(evaluation.competenceEntreprise.fonctionnementEntreprise)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEntreprise.politiqueEnvironnementale !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Comprendre la Politique Environnementale</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEntreprise.politiqueEnvironnementale)}`}>
                          {getNiveauLabel(evaluation.competenceEntreprise.politiqueEnvironnementale)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEntreprise.rechercheInformation !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Rechercher et Sélectionner l'Information</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEntreprise.rechercheInformation)}`}>
                          {getNiveauLabel(evaluation.competenceEntreprise.rechercheInformation)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEntreprise.demarcheProjet !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Démarche Projet</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceEntreprise.demarcheProjet)}`}>
                          {getNiveauLabel(evaluation.competenceEntreprise.demarcheProjet)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceEntreprise.noteGlobale !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        Note Globale
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNoteClass(evaluation.competenceEntreprise.noteGlobale)}`}>
                          {evaluation.competenceEntreprise.noteGlobale}/20
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compétences Scientifiques et Techniques */}
        {evaluation.competenceScientifique && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Compétences Scientifiques et Techniques
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compétence</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluation.competenceScientifique.conceptionPreliminaire !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Conception Préliminaire</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(evaluation.competenceScientifique.conceptionPreliminaire)}`}>
                          {getNiveauLabel(evaluation.competenceScientifique.conceptionPreliminaire)}
                        </span>
                      </td>
                    </tr>
                  )}
                  {evaluation.competenceScientifique.noteGlobale !== undefined && (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        Note Globale
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNoteClass(evaluation.competenceScientifique.noteGlobale)}`}>
                          {evaluation.competenceScientifique.noteGlobale}/20
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compétences Spécifiques */}
        {evaluation.competencesSpecifiques && evaluation.competencesSpecifiques.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Compétences Spécifiques
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compétence</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluation.competencesSpecifiques.map((comp, idx) => (
                    comp && comp.competence && (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{comp.competence}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNiveauClass(comp.evaluation)}`}>
                            {getNiveauLabel(comp.evaluation)}
                          </span>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedEvaluation;