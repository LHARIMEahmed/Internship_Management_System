import React from 'react';
import AccordionSection from '../common/AccordionSection';
import RatingTable from '../common/RatingTable';
import NoteGlobale from '../common/NoteGlobale';
import { NIVEAUX_COMPETENCE, COMPETENCES_INDIVIDUELLES } from '../utils/constants';

/**
 * Composant pour les compétences individuelles avec Tailwind CSS
 * @param {Object} donneesFormulaire - Données du formulaire
 * @param {Function} gererChangement - Fonction pour gérer les changements
 * @returns {JSX.Element}
 */
const CompetencesIndividuelles = ({ donneesFormulaire, gererChangement }) => {
  return (
    <AccordionSection id="collapseDeux" title="Compétences Individuelles">
      <div className="space-y-6">
        <RatingTable
          competences={COMPETENCES_INDIVIDUELLES}
          niveaux={NIVEAUX_COMPETENCE}
          section="competenceEtudiant"
          onChangeFn={gererChangement}
          values={donneesFormulaire.competenceEtudiant}
        />
        
        <NoteGlobale
          section="competenceEtudiant"
          onChangeFn={gererChangement}
          value={donneesFormulaire.competenceEtudiant.noteGlobale}
        />
      </div>
    </AccordionSection>
  );
};

export default CompetencesIndividuelles;