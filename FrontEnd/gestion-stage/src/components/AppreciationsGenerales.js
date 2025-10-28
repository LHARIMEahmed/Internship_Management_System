import React from 'react';

const AppreciationsGenerales = ({ appreciationGlobale, gererChangement, isFieldModified, resetField }) => {
    const optionsImplication = [
        { value: 1, label: 'Paresseux' },
        { value: 2, label: 'Le juste nécessaire' },
        { value: 3, label: 'Bonne' },
        { value: 4, label: 'Très forte' },
        { value: 5, label: 'Dépasse ses objectifs' }
    ];

    const optionsOuverture = [
        { value: 1, label: 'Isolé(e) ou en opposition' },
        { value: 2, label: 'Renfermé(e) ou obtus' },
        { value: 3, label: 'Bonne' },
        { value: 4, label: 'Très bonne' },
        { value: 5, label: 'Excellente' }
    ];

    const optionsQualite = [
        { value: 1, label: 'Médiocre' },
        { value: 2, label: 'Acceptable' },
        { value: 3, label: 'Bonne' },
        { value: 4, label: 'Très bonne' },
        { value: 5, label: 'Très professionnelle' }
    ];

    return (
        <div>
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Implication</label>
                    {isFieldModified && isFieldModified('implication') && (
                        <button
                            type="button"
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => resetField && resetField('implication')}
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
                <div className={`flex flex-wrap gap-4 p-3 rounded-md ${isFieldModified && isFieldModified('implication') ? 'bg-yellow-50 border border-yellow-500' : ''}`}>
                    {optionsImplication.map(option => (
                        <div key={option.value} className="flex items-center">
                            <input
                                id={`implication-${option.value}`}
                                type="radio"
                                name="implication"
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                value={option.value}
                                checked={appreciationGlobale.implication === option.value}
                                onChange={(e) => gererChangement('appreciationGlobale', 'implication', parseInt(e.target.value))}
                            />
                            <label htmlFor={`implication-${option.value}`} className="ml-2 text-sm text-gray-700">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Ouverture aux Autres</label>
                    {isFieldModified && isFieldModified('ouverture') && (
                        <button
                            type="button"
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => resetField && resetField('ouverture')}
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
                <div className={`flex flex-wrap gap-4 p-3 rounded-md ${isFieldModified && isFieldModified('ouverture') ? 'bg-yellow-50 border border-yellow-500' : ''}`}>
                    {optionsOuverture.map(option => (
                        <div key={option.value} className="flex items-center">
                            <input
                                id={`ouverture-${option.value}`}
                                type="radio"
                                name="ouverture"
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                value={option.value}
                                checked={appreciationGlobale.ouverture === option.value}
                                onChange={(e) => gererChangement('appreciationGlobale', 'ouverture', parseInt(e.target.value))}
                            />
                            <label htmlFor={`ouverture-${option.value}`} className="ml-2 text-sm text-gray-700">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Qualité des Productions</label>
                    {isFieldModified && isFieldModified('qualiteProductions') && (
                        <button
                            type="button"
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => resetField && resetField('qualiteProductions')}
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
                <div className={`flex flex-wrap gap-4 p-3 rounded-md ${isFieldModified && isFieldModified('qualiteProductions') ? 'bg-yellow-50 border border-yellow-500' : ''}`}>
                    {optionsQualite.map(option => (
                        <div key={option.value} className="flex items-center">
                            <input
                                id={`qualite-${option.value}`}
                                type="radio"
                                name="qualiteProductions"
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                value={option.value}
                                checked={appreciationGlobale.qualiteProductions === option.value}
                                onChange={(e) => gererChangement('appreciationGlobale', 'qualiteProductions', parseInt(e.target.value))}
                            />
                            <label htmlFor={`qualite-${option.value}`} className="ml-2 text-sm text-gray-700">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Observations</label>
                    {isFieldModified && isFieldModified('observations') && (
                        <button
                            type="button"
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={() => resetField && resetField('observations')}
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
                <textarea
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                    ${isFieldModified && isFieldModified('observations') ? 'bg-yellow-50 border-yellow-500' : 'border-gray-300'}`}
                    rows="4"
                    value={appreciationGlobale.observations || ''}
                    onChange={(e) => gererChangement('appreciationGlobale', 'observations', e.target.value)}
                    placeholder="Ajoutez vos observations ici..."
                ></textarea>
            </div>
        </div>
    );
};

export default AppreciationsGenerales;