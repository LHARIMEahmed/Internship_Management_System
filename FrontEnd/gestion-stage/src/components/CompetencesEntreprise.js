import React from 'react';

const CompetencesEntreprise = ({ competenceEntreprise, gererChangement }) => {
    const niveauxCompetence = [
        { value: 0, label: 'NA' },
        { value: 1, label: 'DÉBUTANT' },
        { value: 2, label: 'AUTONOME' },
        { value: 3, label: 'AUTONOME +' }
    ];

    const competencesEntreprise = [
        { label: 'Analyser le Fonctionnement de l\'Entreprise', field: 'fonctionnementEntreprise' },
        { label: 'Comprendre la Politique Environnementale', field: 'politiqueEnvironnementale' },
        { label: 'Rechercher et Sélectionner l\'Information', field: 'rechercheInformation' },
        { label: 'Démarche Projet', field: 'demarcheProjet' }
    ];

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Compétence
                            </th>
                            {niveauxCompetence.map(niveau => (
                                <th key={niveau.value} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {niveau.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {competencesEntreprise.map(({ label, field }) => (
                            <tr key={field}>
                                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                                    {label}
                                </td>
                                {niveauxCompetence.map(niveau => (
                                    <td key={niveau.value} className="px-6 py-4 whitespace-nowrap text-center">
                                        <input
                                            type="radio"
                                            id={`${field}-${niveau.value}`}
                                            name={field}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            value={niveau.value}
                                            checked={competenceEntreprise[field] === niveau.value}
                                            onChange={(e) => gererChangement('competenceEntreprise', field, parseInt(e.target.value))}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note Globale (/20)
                </label>
                <input
                    type="number"
                    className="w-full sm:w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    max="20"
                    step="0.1"
                    value={parseFloat(competenceEntreprise.noteGlobale).toFixed(1)|| ''}
                    onChange={(e) => gererChangement('competenceEntreprise', 'noteGlobale', e.target.value)}
                />
            </div>
        </div>
    );
};

export default CompetencesEntreprise;