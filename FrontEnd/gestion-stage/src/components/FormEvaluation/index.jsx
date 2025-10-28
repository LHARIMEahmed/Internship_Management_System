import React, { useState } from 'react';
import useFormData from '../../hooks/useFormData';
import { submitEvaluation } from '../utils/api';

// Import des composants
import InfoStage from './InfoStage';
import AppreciationsGenerales from './AppreciationsGenerales';
import CompetencesIndividuelles from './CompetencesIndividuelles';
import CompetencesEntreprise from './CompetencesEntreprise';
import CompetencesScientifiques from './CompetencesScientifiques';
import CompetencesSpecifiques from './CompetencesSpecifiques';

/**
 * Composant principal du formulaire d'évaluation avec Tailwind CSS
 * @returns {JSX.Element}
 */
const FormulaireEvaluation = () => {
  // État pour indiquer si le formulaire est en cours de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Utilisation du hook personnalisé pour la gestion des données
  const {
    donneesFormulaire,
    stagiaires,
    selectedStagiaireCin,
    tuteur,
    gererChangement,
    gererChangementPrincipal,
    gererChangementCompetenceSpecifique,
  } = useFormData();
  

  /**
   * Gestion de la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  const gererSoumission = async (e) => {
    e.preventDefault();
    
    // Validation du formulaire
    if (!donneesFormulaire.nomStagiaire || !donneesFormulaire.nomEntreprise || !donneesFormulaire.dateDebut || !donneesFormulaire.dateFin) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!selectedStagiaireCin || selectedStagiaireCin === '') {
      alert('Veuillez sélectionner un stagiaire.');
      return;
    }
    
    if (!tuteur.username || tuteur.username === 'Inconnu') {
      alert('Le CIN du tuteur est invalide. Vérifiez les données du tuteur.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Préparation des données pour la soumission
      const evaluationData = {
        ...donneesFormulaire,
        selectedStagiaireCin,
        tuteurCin: tuteur.username
      };
      
      // Appel à l'API pour soumettre l'évaluation
      const result = await submitEvaluation(evaluationData);
      
      alert(result.message);
      
      // Redirection ou réinitialisation du formulaire pourrait être ajoutée ici
      
    } catch (error) {
      console.error('Erreur détaillée:', error.response ? error.response.data : error.message);
      alert(`Une erreur est survenue: ${error.response ? error.response.data.message || error.message : error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white text-center">Formulaire d'Évaluation de Stage</h1>
        </div>
        
        <div className="p-6">
          <form onSubmit={gererSoumission} className="space-y-6">
            {/* Section Informations du Stage */}
            <InfoStage
              donneesFormulaire={donneesFormulaire}
              stagiaires={stagiaires}
              gererChangementPrincipal={gererChangementPrincipal}
            />
            
            {/* Accordéon pour les différentes sections d'évaluation */}
            <div className="space-y-4">
              {/* Section Appréciations Générales */}
              <AppreciationsGenerales
                donneesFormulaire={donneesFormulaire}
                gererChangement={gererChangement}
              />
              
              {/* Section Compétences Individuelles */}
              <CompetencesIndividuelles
                donneesFormulaire={donneesFormulaire}
                gererChangement={gererChangement}
              />
              
              {/* Section Compétences de l'Entreprise */}
              <CompetencesEntreprise
                donneesFormulaire={donneesFormulaire}
                gererChangement={gererChangement}
              />
              
              {/* Section Compétences Scientifiques et Techniques */}
              <CompetencesScientifiques
                donneesFormulaire={donneesFormulaire}
                gererChangement={gererChangement}
              />
              
              {/* Section Compétences Spécifiques */}
              <CompetencesSpecifiques
                donneesFormulaire={donneesFormulaire}
                gererChangementCompetenceSpecifique={gererChangementCompetenceSpecifique}
              />
            </div>
            
            {/* Bouton de soumission */}
            <div className="flex justify-center pt-6">
              <button 
                type="submit" 
                className={`px-6 py-3 font-semibold rounded-lg text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Soumission en cours...
                  </span>
                ) : (
                  'Soumettre l\'Évaluation'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormulaireEvaluation;