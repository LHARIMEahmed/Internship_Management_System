import React from 'react';

const CompetencesSpecifiques = ({ competencesSpecifiques, gererChangementCompetenceSpecifique }) => {
    const niveauxCompetenceSpecifique = [
        { value: 1, label: 'DÉBUTANT' },
        { value: 2, label: 'AUTONOME' },
        { value: 3, label: 'AUTONOME +' }
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
                            {niveauxCompetenceSpecifique.map(niveau => (
                                <th key={niveau.value} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {niveau.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {competencesSpecifiques.map((comp, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={comp.competence || ''}
                                        onChange={(e) => gererChangementCompetenceSpecifique(index, 'competence', e.target.value)}
                                        placeholder={`Compétence ${index + 1}`}
                                    />
                                </td>
                                {niveauxCompetenceSpecifique.map(niveau => (
                                    <td key={niveau.value} className="px-6 py-4 whitespace-nowrap text-center">
                                        <input
                                            type="radio"
                                            id={`competenceSpecifique${index}-${niveau.value}`}
                                            name={`competenceSpecifique${index}`}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            value={niveau.value}
                                            checked={comp.evaluation === niveau.value}
                                            onChange={(e) => gererChangementCompetenceSpecifique(index, 'evaluation', parseInt(e.target.value))}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
                <p>Ajoutez jusqu'à 5 compétences spécifiques liées au stage et évaluez le niveau atteint par le stagiaire.</p>
                <p>Seules les compétences avec un texte et une évaluation seront enregistrées.</p>
            </div>
        </div>
    );
};

export default CompetencesSpecifiques;