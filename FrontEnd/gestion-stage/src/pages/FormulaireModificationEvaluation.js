import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Importations des composants avec les chemins corrects
import InformationsStage from '../components/InformationsStage';
import AppreciationsGenerales from '../components/AppreciationsGenerales';
import CompetencesIndividuelles from '../components/CompetencesIndividuelles';
import CompetencesEntreprise from '../components/CompetencesEntreprise';
import CompetencesScientifiques from '../components/CompetencesScientifiques';
import CompetencesSpecifiques from '../components/CompetencesSpecifiques';
import { fetchEvaluationData, updateEvaluation } from '../services/evaluationService';

const FormulaireModificationEvaluation = () => {
    const [donneesFormulaire, setDonneesFormulaire] = useState({
        nomStagiaire: '',
        stagiaireId: '',
        nomEntreprise: '',
        descriptionStage: '',
        objectifStage: '',
        tuteurNom: '',
        tuteurId: '',
        dateDebut: '',
        dateFin: '',
        stageId: null,
        appreciationId: null,
        appreciationGlobale: {
            implication: null,
            ouverture: null,
            qualiteProductions: null,
            observations: ''
        },
        competenceEtudiant: {
            id: null,
            analyseSynthese: null,
            autoEvaluation: null,
            contexteInternational: null,
            faireAdhererActeurs: null,
            identifierProblemes: null,
            methodesAxesTravail: null,
            noteGlobale: ''
        },
        competenceEntreprise: {
            id: null,
            fonctionnementEntreprise: null,
            politiqueEnvironnementale: null,
            rechercheInformation: null,
            demarcheProjet: null,
            noteGlobale: ''
        },
        competenceScientifiqueTechnique: {
            id: null,
            conceptionPreliminaire: null,
            noteGlobale: ''
        },
        competencesSpecifiques: Array(5).fill({ competence: '', evaluation: null })
    });
    
    // État pour gérer l'ouverture/fermeture des sections
    const [openSection, setOpenSection] = useState('informations');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { periodeId } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        
        if (periodeId) {
            fetchEvaluationData(periodeId, setDonneesFormulaire, setLoading, setError, currentUser);
        } else {
            setError("ID de période non spécifié.");
            setLoading(false);
        }
    }, [periodeId]);

    const gererChangement = (section, champ, valeur) => {
        setDonneesFormulaire(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [champ]: valeur
            }
        }));
    };

    const gererChangementPrincipal = (e) => {
        const { name, value } = e.target;
        setDonneesFormulaire(prev => ({ ...prev, [name]: value }));
    };

    const gererChangementCompetenceSpecifique = (index, champ, valeur) => {
        const competencesMisesAJour = [...donneesFormulaire.competencesSpecifiques];
        competencesMisesAJour[index] = {
            ...competencesMisesAJour[index],
            [champ]: valeur
        };
        setDonneesFormulaire(prev => ({
            ...prev,
            competencesSpecifiques: competencesMisesAJour
        }));
    };

    // Fonction pour déterminer si un champ a été modifié
    const isFieldModified = (section, field) => {
        if (!donneesFormulaire.originalData) return false;
        
        if (section === 'main') {
            return donneesFormulaire[field] !== donneesFormulaire.originalData[field];
        }
        
        const original = donneesFormulaire.originalData[section];
        const current = donneesFormulaire[section];
        
        if (!original || !current) return false;
        
        return original[field] !== current[field];
    };

    // Fonction pour réinitialiser un champ à sa valeur originale
    const resetField = (section, field) => {
        if (!donneesFormulaire.originalData) return;
        
        if (section === 'main') {
            setDonneesFormulaire(prev => ({
                ...prev,
                [field]: prev.originalData[field]
            }));
            return;
        }
        
        setDonneesFormulaire(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: prev.originalData[section][field]
            }
        }));
    };

    // Fonction pour basculer les sections
    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const gererSoumission = async (e) => {
        e.preventDefault();
        
        try {
            setIsSubmitting(true);
            setError(null);
            
            // Les champs obligatoires ne sont plus nécessaires ici
            // car nous avons modifié le service pour qu'il envoie uniquement
            // les champs modifiés
            
            const actionsEffectuees = await updateEvaluation(periodeId, donneesFormulaire);
            console.log("Actions effectuées:", actionsEffectuees);
            
            setSuccess("Les modifications ont été enregistrées avec succès !");
            
            // Redirection après un court délai
            setTimeout(() => {
                navigate('/tuteur-dashboard');
            }, 2000);
        } catch (error) {
            console.error('Erreur détaillée:', error);
            setError(error.message || "Une erreur est survenue pendant la mise à jour");
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <h4 className="text-lg font-bold mb-2">Erreur!</h4>
                    <p>{error}</p>
                    <button 
                        className="mt-4 bg-red-200 hover:bg-red-300 text-red-700 font-medium py-2 px-4 rounded transition"
                        onClick={() => navigate('/tuteur-dashboard')}
                    >
                        Retour au tableau de bord
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Modification de l'Évaluation</h1>
                <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition"
                    onClick={() => navigate('/tuteur-dashboard')}
                >
                    Retour au tableau de bord
                </button>
            </div>
            
            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                    <p className="font-semibold">{success}</p>
                </div>
            )}
            
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
                <p>
                    <span className="font-semibold">Note:</span> Vous pouvez modifier uniquement les champs que vous souhaitez mettre à jour. 
                    Tous les champs sont optionnels et seuls les champs modifiés seront enregistrés.
                </p>
            </div>
            
            <form onSubmit={gererSoumission} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium mb-4">Informations du Stage</h2>
                    <InformationsStage 
                        donneesFormulaire={donneesFormulaire} 
                        gererChangementPrincipal={gererChangementPrincipal}
                        isFieldModified={(field) => isFieldModified('main', field)}
                        resetField={(field) => resetField('main', field)}
                    />
                </div>

                <div>
                    <div className="border-b border-gray-200">
                        <button 
                            className={`w-full py-4 px-6 text-left font-medium text-lg focus:outline-none ${openSection === 'appreciations' ? 'bg-blue-50' : 'bg-white'}`}
                            onClick={() => toggleSection('appreciations')}
                            type="button"
                        >
                            <div className="flex justify-between items-center">
                                <span>Appréciations Générales</span>
                                <svg className={`w-5 h-5 transform ${openSection === 'appreciations' ? 'rotate-180' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === 'appreciations' ? 'max-h-screen' : 'max-h-0'}`}>
                            <div className="p-6">
                                <AppreciationsGenerales 
                                    appreciationGlobale={donneesFormulaire.appreciationGlobale} 
                                    gererChangement={gererChangement}
                                    isFieldModified={(field) => isFieldModified('appreciationGlobale', field)}
                                    resetField={(field) => resetField('appreciationGlobale', field)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <button 
                            className={`w-full py-4 px-6 text-left font-medium text-lg focus:outline-none ${openSection === 'individuelles' ? 'bg-blue-50' : 'bg-white'}`}
                            onClick={() => toggleSection('individuelles')}
                            type="button"
                        >
                            <div className="flex justify-between items-center">
                                <span>Compétences Individuelles</span>
                                <svg className={`w-5 h-5 transform ${openSection === 'individuelles' ? 'rotate-180' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === 'individuelles' ? 'max-h-screen' : 'max-h-0'}`}>
                            <div className="p-6">
                                <CompetencesIndividuelles 
                                    competenceEtudiant={donneesFormulaire.competenceEtudiant} 
                                    gererChangement={gererChangement}
                                    isFieldModified={(field) => isFieldModified('competenceEtudiant', field)}
                                    resetField={(field) => resetField('competenceEtudiant', field)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <button 
                            className={`w-full py-4 px-6 text-left font-medium text-lg focus:outline-none ${openSection === 'entreprise' ? 'bg-blue-50' : 'bg-white'}`}
                            onClick={() => toggleSection('entreprise')}
                            type="button"
                        >
                            <div className="flex justify-between items-center">
                                <span>Compétences de l'Entreprise</span>
                                <svg className={`w-5 h-5 transform ${openSection === 'entreprise' ? 'rotate-180' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === 'entreprise' ? 'max-h-screen' : 'max-h-0'}`}>
                            <div className="p-6">
                                <CompetencesEntreprise 
                                    competenceEntreprise={donneesFormulaire.competenceEntreprise} 
                                    gererChangement={gererChangement}
                                    isFieldModified={(field) => isFieldModified('competenceEntreprise', field)}
                                    resetField={(field) => resetField('competenceEntreprise', field)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <button 
                            className={`w-full py-4 px-6 text-left font-medium text-lg focus:outline-none ${openSection === 'scientifiques' ? 'bg-blue-50' : 'bg-white'}`}
                            onClick={() => toggleSection('scientifiques')}
                            type="button"
                        >
                            <div className="flex justify-between items-center">
                                <span>Compétences Scientifiques et Techniques</span>
                                <svg className={`w-5 h-5 transform ${openSection === 'scientifiques' ? 'rotate-180' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === 'scientifiques' ? 'max-h-screen' : 'max-h-0'}`}>
                            <div className="p-6">
                                <CompetencesScientifiques 
                                    competenceScientifiqueTechnique={donneesFormulaire.competenceScientifiqueTechnique} 
                                    gererChangement={gererChangement}
                                    isFieldModified={(field) => isFieldModified('competenceScientifiqueTechnique', field)}
                                    resetField={(field) => resetField('competenceScientifiqueTechnique', field)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <button 
                            className={`w-full py-4 px-6 text-left font-medium text-lg focus:outline-none ${openSection === 'specifiques' ? 'bg-blue-50' : 'bg-white'}`}
                            onClick={() => toggleSection('specifiques')}
                            type="button"
                        >
                            <div className="flex justify-between items-center">
                                <span>Compétences Spécifiques</span>
                                <svg className={`w-5 h-5 transform ${openSection === 'specifiques' ? 'rotate-180' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </button>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === 'specifiques' ? 'max-h-screen' : 'max-h-0'}`}>
                            <div className="p-6">
                                <CompetencesSpecifiques 
                                    competencesSpecifiques={donneesFormulaire.competencesSpecifiques} 
                                    gererChangementCompetenceSpecifique={gererChangementCompetenceSpecifique}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between p-6 bg-gray-50">
                    <button 
                        type="button" 
                        className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium py-2 px-6 rounded transition"
                        onClick={() => navigate('/tuteur-dashboard')}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </button>
                    <button 
                        type="submit" 
                        className={`${isSubmitting 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700'} 
                            text-white font-medium py-2 px-6 rounded transition`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormulaireModificationEvaluation;