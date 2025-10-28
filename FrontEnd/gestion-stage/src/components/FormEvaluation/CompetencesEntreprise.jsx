import React from 'react';
import AccordionSection from '../common/AccordionSection';
import RatingTable from '../common/RatingTable';
import NoteGlobale from '../common/NoteGlobale';
import { NIVEAUX_COMPETENCE, COMPETENCES_ENTREPRISE } from '../utils/constants';

/**
 * Composant pour les compétences de l'entreprise avec Tailwind CSS
 * @param {Object} donneesFormulaire - Données du formulaire
 * @param {Function} gererChangement - Fonction pour gérer les changements
 * @returns {JSX.Element}
 */
const CompetencesEntreprise = ({ donneesFormulaire, gererChangement }) => {
  return (
    <AccordionSection id="collapseTrois" title="Compétences de l'Entreprise">
      <div className="space-y-6">
        <RatingTable
          competences={COMPETENCES_ENTREPRISE}
          niveaux={NIVEAUX_COMPETENCE}
          section="competenceEntreprise"
          onChangeFn={gererChangement}
          values={donneesFormulaire.competenceEntreprise}
        />
        
        <NoteGlobale
          section="competenceEntreprise"
          onChangeFn={gererChangement}
          value={donneesFormulaire.competenceEntreprise.noteGlobale}
        />
      </div>
    </AccordionSection>
  );
};

export default CompetencesEntreprise;