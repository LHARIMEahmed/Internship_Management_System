import React from 'react';

/**
 * Composant de table pour évaluer les compétences avec Tailwind CSS
 * @param {Array} competences - Liste des compétences à évaluer
 * @param {Array} niveaux - Liste des niveaux d'évaluation
 * @param {string} section - Nom de la section dans le formulaire
 * @param {Function} onChangeFn - Fonction appelée lors d'un changement
 * @param {Object} values - Valeurs actuelles
 * @returns {JSX.Element}
 */
const RatingTable = ({ competences, niveaux, section, onChangeFn, values }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Compétence
            </th>
            {niveaux.map(niveau => (
              <th 
                key={niveau.value} 
                className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider"
              >
                {niveau.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {competences.map(({ label, field }) => (
            <tr key={field} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-700">
                {label}
              </td>
              {niveaux.map(niveau => (
                <td key={niveau.value} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={field}
                        value={niveau.value}
                        checked={values[field] === niveau.value}
                        onChange={(e) => onChangeFn(section, field, parseInt(e.target.value))}
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
  );
};

export default RatingTable;