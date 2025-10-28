import React from 'react';
import AccordionSection from '../common/AccordionSection';
import { NIVEAUX_COMPETENCE_SPECIFIQUE } from '../utils/constants';

/**
 * Composant pour les compétences spécifiques avec Tailwind CSS
 * @param {Object} donneesFormulaire - Données du formulaire
 * @param {Function} gererChangementCompetenceSpecifique - Fonction pour gérer les changements
 * @returns {JSX.Element}
 */
const CompetencesSpecifiques = ({ donneesFormulaire, gererChangementCompetenceSpecifique }) => {
  return (
    <AccordionSection id="collapseCinq" title="Compétences Spécifiques">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider w-1/2">
                Compétence
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
            {donneesFormulaire.competencesSpecifiques.map((comp, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    value={comp.competence}
                    onChange={(e) => gererChangementCompetenceSpecifique(index, 'competence', e.target.value)}
                    placeholder={`Compétence ${index + 1}`}
                  />
                </td>
                {NIVEAUX_COMPETENCE_SPECIFIQUE.map(niveau => (
                  <td key={niveau.value} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`competenceSpecifique${index}`}
                          value={niveau.value}
                          checked={comp.evaluation === niveau.value}
                          onChange={(e) => gererChangementCompetenceSpecifique(index, 'evaluation', parseInt(e.target.value))}
                          className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                        />
                      </label>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          onClick={() => gererChangementCompetenceSpecifique(donneesFormulaire.competencesSpecifiques.length, 'add')}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ajouter une compétence
          </span>
        </button>
      </div>
    </AccordionSection>
  );
};

export default CompetencesSpecifiques;