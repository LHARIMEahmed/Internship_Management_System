// src/components/TuteurEvaluationViewer.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TuteurEvaluationViewer = ({ periodeId, onClose }) => {
  const [evaluation, setEvaluation] = useState({
    appreciation: null,
    competenceEtudiant: null,
    competenceEntreprise: null,
    competenceScientifique: null,
    competencesSpecifiques: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!periodeId) return;
      
      try {
        // Récupérer l'appréciation globale
        const appreciationResponse = await axios.get(`http://localhost:8080/api/appreciations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(() => ({ data: [] }));
        
        // Filtrer l'appréciation pour cette période
        const appreciation = Array.isArray(appreciationResponse.data) ? 
          appreciationResponse.data.find(a => a.periode?.id === parseInt(periodeId)) : null;
        
        // Récupérer les compétences étudiant
        const compEtudiantResponse = await axios.get(`http://localhost:8080/api/competences-etudiant`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(() => ({ data: [] }));
        
        const competenceEtudiant = Array.isArray(compEtudiantResponse.data) ? 
          compEtudiantResponse.data.find(c => c.periode?.id === parseInt(periodeId)) : null;
        
        // Récupérer les compétences entreprise
        const compEntrepriseResponse = await axios.get(`http://localhost:8080/api/competences-entreprise`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(() => ({ data: [] }));
        
        const competenceEntreprise = Array.isArray(compEntrepriseResponse.data) ? 
          compEntrepriseResponse.data.find(c => c.periode?.id === parseInt(periodeId)) : null;
        
        // Récupérer les compétences scientifiques
        const compScientifiqueResponse = await axios.get(`http://localhost:8080/api/competences-scientifiques`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(() => ({ data: [] }));
        
        const competenceScientifique = Array.isArray(compScientifiqueResponse.data) ? 
          compScientifiqueResponse.data.find(c => c.periode?.id === parseInt(periodeId)) : null;
        
        // Récupérer les compétences spécifiques
        const compSpecifiqueResponse = await axios.get(`http://localhost:8080/api/competences-specifiques`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }).catch(() => ({ data: [] }));
        
        const competencesSpecifiques = Array.isArray(compSpecifiqueResponse.data) ? 
          compSpecifiqueResponse.data.filter(c => c.periode?.id === parseInt(periodeId)) : [];
        
        setEvaluation({
          appreciation,
          competenceEtudiant,
          competenceEntreprise,
          competenceScientifique,
          competencesSpecifiques
        });
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'évaluation:", err);
        setError("Impossible de charger les détails de l'évaluation");
        setLoading(false);
      }
    };
    
    fetchEvaluation();
  }, [periodeId]);

  // Gérer la redirection vers le formulaire de modification
  const handleModification = () => {
    navigate(`/modifier-evaluation/${periodeId}`);
  };

  // Fonctions d'aide pour convertir les notes numériques en libellés
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
            <h2 className="text-2xl font-bold text-gray-800">Détails de l'évaluation</h2>
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
        </div>
      </div>
    );
  }
  
  const hasNoEvaluations = !evaluation.appreciation && 
                         !evaluation.competenceEtudiant && 
                         !evaluation.competenceEntreprise && 
                         !evaluation.competenceScientifique && 
                         evaluation.competencesSpecifiques.length === 0;
  
  if (hasNoEvaluations) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Détails de l'évaluation</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
            <p className="text-gray-600">Aucune évaluation n'a encore été faite pour ce stagiaire.</p>
            <button 
              className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 transition"
              onClick={() => navigate(`/evaluation-form?periodeId=${periodeId}`)}
            >
              Créer une évaluation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Détails de l'évaluation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
                  {[
                    { label: 'Analyse et Synthèse', field: 'analyseSynthese' },
                    { label: 'Auto-Évaluation', field: 'autoEvaluation' },
                    { label: 'Contexte International', field: 'contexteInternational' },
                    { label: 'Faire Adhérer les Acteurs', field: 'faireAdhererActeurs' },
                    { label: 'Identifier les Problèmes', field: 'identifierProblemes' },
                    { label: 'Méthodes et Axes de Travail', field: 'methodesAxesTravail' }
                  ].map(({ label, field }) => (
                    <tr key={field}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{label}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${evaluation.competenceEtudiant[field] === 0 ? "gray" : evaluation.competenceEtudiant[field] === 1 ? "red" : evaluation.competenceEtudiant[field] === 2 ? "yellow" : "green"}-100 text-${evaluation.competenceEtudiant[field] === 0 ? "gray" : evaluation.competenceEtudiant[field] === 1 ? "red" : evaluation.competenceEtudiant[field] === 2 ? "yellow" : "green"}-800`}>
                          {getNiveauLabel(evaluation.competenceEtudiant[field])}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Note Globale</p>
                <p className="text-xl font-semibold">{evaluation.competenceEtudiant.noteGlobale}/20</p>
              </div>
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
                  {[
                    { label: 'Analyser le Fonctionnement de l\'Entreprise', field: 'fonctionnementEntreprise' },
                    { label: 'Comprendre la Politique Environnementale', field: 'politiqueEnvironnementale' },
                    { label: 'Rechercher et Sélectionner l\'Information', field: 'rechercheInformation' },
                    { label: 'Démarche Projet', field: 'demarcheProjet' }
                  ].map(({ label, field }) => (
                    <tr key={field}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{label}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${evaluation.competenceEntreprise[field] === 0 ? "gray" : evaluation.competenceEntreprise[field] === 1 ? "red" : evaluation.competenceEntreprise[field] === 2 ? "yellow" : "green"}-100 text-${evaluation.competenceEntreprise[field] === 0 ? "gray" : evaluation.competenceEntreprise[field] === 1 ? "red" : evaluation.competenceEntreprise[field] === 2 ? "yellow" : "green"}-800`}>
                          {getNiveauLabel(evaluation.competenceEntreprise[field])}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Note Globale</p>
                <p className="text-xl font-semibold">{evaluation.competenceEntreprise.noteGlobale}/20</p>
              </div>
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
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Conception Préliminaire</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${evaluation.competenceScientifique.conceptionPreliminaire === 0 ? "gray" : evaluation.competenceScientifique.conceptionPreliminaire === 1 ? "red" : evaluation.competenceScientifique.conceptionPreliminaire === 2 ? "yellow" : "green"}-100 text-${evaluation.competenceScientifique.conceptionPreliminaire === 0 ? "gray" : evaluation.competenceScientifique.conceptionPreliminaire === 1 ? "red" : evaluation.competenceScientifique.conceptionPreliminaire === 2 ? "yellow" : "green"}-800`}>
                        {getNiveauLabel(evaluation.competenceScientifique.conceptionPreliminaire)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Note Globale</p>
                <p className="text-xl font-semibold">{evaluation.competenceScientifique.noteGlobale}/20</p>
              </div>
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
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{comp.competence}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${comp.evaluation === 1 ? "red" : comp.evaluation === 2 ? "yellow" : "green"}-100 text-${comp.evaluation === 1 ? "red" : comp.evaluation === 2 ? "yellow" : "green"}-800`}>
                          {getNiveauLabel(comp.evaluation)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-right">
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 transition"
            onClick={handleModification}
          >
            Modifier l'évaluation
          </button>
        </div>
      </div>
    </div>
  );
};

export default TuteurEvaluationViewer;