import React from 'react';

/**
 * Composant pour la note globale avec Tailwind CSS
 * @param {string} section - Nom de la section dans le formulaire
 * @param {Function} onChangeFn - Fonction appelée lors d'un changement
 * @param {string} value - Valeur actuelle
 * @returns {JSX.Element}
 */
const NoteGlobale = ({ section, onChangeFn, value }) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2">
        Note Globale (/20)
      </label>
      <input
        type="number"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        min="0"
        max="20"
        step="0.1"
        value={value}
        onChange={(e) => onChangeFn(section, 'noteGlobale', e.target.value)}
      />
    </div>
  );
};

export default NoteGlobale;