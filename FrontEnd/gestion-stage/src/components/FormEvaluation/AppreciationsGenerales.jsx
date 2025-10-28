import React from 'react';
import AccordionSection from '../common/AccordionSection';
import { OPTIONS_IMPLICATION, OPTIONS_OUVERTURE, OPTIONS_QUALITE } from '../utils/constants';

/**
 * Composant pour les appréciations générales avec Tailwind CSS
 * @param {Object} donneesFormulaire - Données du formulaire
 * @param {Function} gererChangement - Fonction pour gérer les changements
 * @returns {JSX.Element}
 */
const AppreciationsGenerales = ({ donneesFormulaire, gererChangement }) => {
  return (
    <AccordionSection id="collapseUn" title="Appréciations Générales" isOpen={true}>
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Implication</label>
          <div className="flex flex-wrap gap-3">
            {OPTIONS_IMPLICATION.map(option => (
              <div className="flex items-center" key={option.value}>
                <input
                  id={`implication-${option.value}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  type="radio"
                  name="implication"
                  value={option.value}
                  checked={donneesFormulaire.appreciationGlobale.implication === option.value}
                  onChange={(e) => gererChangement('appreciationGlobale', 'implication', parseInt(e.target.value))}
                />
                <label 
                  htmlFor={`implication-${option.value}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Ouverture aux Autres</label>
          <div className="flex flex-wrap gap-3">
            {OPTIONS_OUVERTURE.map(option => (
              <div className="flex items-center" key={option.value}>
                <input
                  id={`ouverture-${option.value}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  type="radio"
                  name="ouverture"
                  value={option.value}
                  checked={donneesFormulaire.appreciationGlobale.ouverture === option.value}
                  onChange={(e) => gererChangement('appreciationGlobale', 'ouverture', parseInt(e.target.value))}
                />
                <label 
                  htmlFor={`ouverture-${option.value}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Qualité des Productions</label>
          <div className="flex flex-wrap gap-3">
            {OPTIONS_QUALITE.map(option => (
              <div className="flex items-center" key={option.value}>
                <input
                  id={`qualite-${option.value}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  type="radio"
                  name="qualiteProductions"
                  value={option.value}
                  checked={donneesFormulaire.appreciationGlobale.qualiteProductions === option.value}
                  onChange={(e) => gererChangement('appreciationGlobale', 'qualiteProductions', parseInt(e.target.value))}
                />
                <label 
                  htmlFor={`qualite-${option.value}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Observations</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows="4"
            value={donneesFormulaire.appreciationGlobale.observations}
            onChange={(e) => gererChangement('appreciationGlobale', 'observations', e.target.value)}
          ></textarea>
        </div>
      </div>
    </AccordionSection>
  );
};

export default AppreciationsGenerales;