import React from 'react';

const InformationsStage = ({ donneesFormulaire, gererChangementPrincipal, isFieldModified, resetField }) => {
    // Fonction pour formater les dates au format YYYY-MM-DD uniquement
    const formaterDate = (dateString) => {
        if (!dateString) return '';
        // Si la date contient déjà l'heure (format ISO), extraire seulement la date
        if (dateString.includes('T')) {
            return dateString.split('T')[0];
        }
        return dateString;
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        NOM et Prénom du stagiaire
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                        value={donneesFormulaire.nomStagiaire}
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                        <span>Nom de l'entreprise</span>
                        {isFieldModified && isFieldModified('nomEntreprise') && (
                            <button
                                type="button"
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => resetField && resetField('nomEntreprise')}
                            >
                                Réinitialiser
                            </button>
                        )}
                    </label>
                    <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                        ${isFieldModified && isFieldModified('nomEntreprise') ? 'bg-yellow-50 border-yellow-500' : 'border-gray-300'}`}
                        name="nomEntreprise"
                        value={donneesFormulaire.nomEntreprise}
                        onChange={gererChangementPrincipal}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        NOM et Prénom du tuteur
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                        value={donneesFormulaire.tuteurNom}
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Période du stage
                        {(isFieldModified && (isFieldModified('dateDebut') || isFieldModified('dateFin'))) && (
                            <button
                                type="button"
                                className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                    resetField && resetField('dateDebut');
                                    resetField && resetField('dateFin');
                                }}
                            >
                                Réinitialiser
                            </button>
                        )}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <input
                                type="date"
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                ${isFieldModified && isFieldModified('dateDebut') ? 'bg-yellow-50 border-yellow-500' : 'border-gray-300'}`}
                                name="dateDebut"
                                value={formaterDate(donneesFormulaire.dateDebut)}
                                onChange={gererChangementPrincipal}
                            />
                        </div>
                        <div>
                            <input
                                type="date"
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                ${isFieldModified && isFieldModified('dateFin') ? 'bg-yellow-50 border-yellow-500' : 'border-gray-300'}`}
                                name="dateFin"
                                value={formaterDate(donneesFormulaire.dateFin)}
                                onChange={gererChangementPrincipal}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                        <span>Description du stage</span>
                        {isFieldModified && isFieldModified('descriptionStage') && (
                            <button
                                type="button"
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => resetField && resetField('descriptionStage')}
                            >
                                Réinitialiser
                            </button>
                        )}
                    </label>
                    <textarea
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        ${isFieldModified && isFieldModified('descriptionStage') ? 'bg-yellow-50 border-yellow-500' : 'border-gray-300'}`}
                        name="descriptionStage"
                        value={donneesFormulaire.descriptionStage}
                        onChange={gererChangementPrincipal}
                        rows="4"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                        Ce champ est optionnel. Ne le modifiez que si nécessaire.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                        <span>Objectif du stage</span>
                        {isFieldModified && isFieldModified('objectifStage') && (
                            <button
                                type="button"
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => resetField && resetField('objectifStage')}
                            >
                                Réinitialiser
                            </button>
                        )}
                    </label>
                    <textarea
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                        ${isFieldModified && isFieldModified('objectifStage') ? 'bg-yellow-50 border-yellow-500' : 'border-gray-300'}`}
                        name="objectifStage"
                        value={donneesFormulaire.objectifStage}
                        onChange={gererChangementPrincipal}
                        rows="4"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                        Ce champ est optionnel. Ne le modifiez que si nécessaire.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InformationsStage;