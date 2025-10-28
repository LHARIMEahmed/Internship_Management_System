import React from 'react';
import AccordionSection from '../common/AccordionSection';
import NoteGlobale from '../common/NoteGlobale';
import { NIVEAUX_COMPETENCE } from '../utils/constants';

/**
 * Composant pour les compétences scientifiques et techniques avec Tailwind CSS
 * @param {Object} donneesFormulaire - Données du formulaire
 * @param {Function} gererChangement - Fonction pour gérer les changements
 * @returns {JSX.Element}
 */
const CompetencesScientifiques = ({ donneesFormulaire, gererChangement }) => {
  return (
    <AccordionSection id="collapseQuatre" title="Compétences Scientifiques et Techniques">
      <div className="space-y-6">
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Compétence
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                  NA
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                  DÉBUTANT
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                  AUTONOME
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                  AUTONOME +
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-700">
                  Conception Préliminaire
                </td>
                {NIVEAUX_COMPETENCE.map(niveau => (
                  <td key={niveau.value} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="conceptionPreliminaire"
                          value={niveau.value}
                          checked={donneesFormulaire.competenceScientifiqueTechnique.conceptionPreliminaire === niveau.value}
                          onChange={(e) => gererChangement('competenceScientifiqueTechnique', 'conceptionPreliminaire', parseInt(e.target.value))}
                          className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                        />
                      </label>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        <NoteGlobale
          section="competenceScientifiqueTechnique"
          onChangeFn={gererChangement}
          value={donneesFormulaire.competenceScientifiqueTechnique.noteGlobale}
        />
      </div>
    </AccordionSection>
  );
};

export default CompetencesScientifiques;