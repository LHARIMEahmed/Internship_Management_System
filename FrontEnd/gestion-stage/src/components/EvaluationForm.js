import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Simuler un contexte d'authentification ou utiliser localStorage
const getAuthData = () => {
    const authData = localStorage.getItem('userData');
    console.log('Valeur brute de localStorage userData:', authData);
    return authData ? JSON.parse(authData) : { role: '', nom: 'Inconnu', prenom: 'Inconnu', username: 'Inconnu' };
};

const FormulaireEvaluation = () => {
    const [donneesFormulaire, setDonneesFormulaire] = useState({
        nomStagiaire: '',
        nomEntreprise: '',
        descriptionStage: '',
        objectifStage: '',
        tuteurNom: '',
        dateDebut: '',
        dateFin: '',
        appreciationGlobale: {
            implication: null,
            ouverture: null,
            qualiteProductions: null,
            observations: ''
        },
        competenceEtudiant: {
            analyseSynthese: null,
            autoEvaluation: null,
            contexteInternational: null,
            faireAdhererActeurs: null,
            identifierProblemes: null,
            methodesAxesTravail: null,
            noteGlobale: ''
        },
        competenceEntreprise: {
            fonctionnementEntreprise: null,
            politiqueEnvironnementale: null,
            rechercheInformation: null,
            demarcheProjet: null,
            noteGlobale: ''
        },
        competenceScientifiqueTechnique: {
            conceptionPreliminaire: null,
            noteGlobale: ''
        },
        competencesSpecifiques: [
            { competence: '', evaluation: null },
            { competence: '', evaluation: null },
            { competence: '', evaluation: null },
            { competence: '', evaluation: null },
            { competence: '', evaluation: null }
        ]
    });

    const [stagiaires, setStagiaires] = useState([]);
    const [selectedStagiaireCin, setSelectedStagiaireCin] = useState('');
    const location = useLocation();
    const [tuteur, setTuteur] = useState(location.state?.tuteur || { nom: 'Inconnu', prenom: 'Inconnu', cin: 'Inconnu' });

    useEffect(() => {
        const authData = getAuthData();
        console.log('Données authData:', authData);
        console.log('Données location.state.tuteur:', location.state?.tuteur);

        if (authData.username && authData.username !== 'Inconnu') {
            console.log('Mise à jour avec authData:', authData);
            setTuteur({
                nom: authData.nom,
                prenom: authData.prenom,
                cin: authData.username
            });
            setDonneesFormulaire(prev => ({
                ...prev,
                tuteurNom: `${authData.prenom} ${authData.nom}`
            }));
        } else if (location.state?.tuteur && location.state.tuteur.username && location.state.tuteur.username !== 'Inconnu') {
            console.log('Mise à jour avec location.state.tuteur:', location.state.tuteur);
            setTuteur({
                nom: location.state.tuteur.nom,
                prenom: location.state.tuteur.prenom,
                cin: location.state.tuteur.username
            });
            setDonneesFormulaire(prev => ({
                ...prev,
                tuteurNom: `${location.state.tuteur.prenom} ${location.state.tuteur.nom}`
            }));
        } else {
            console.log('Aucune donnée valide trouvée, utilisation des valeurs par défaut');
            setTuteur({ nom: 'Inconnu', prenom: 'Inconnu', cin: 'Inconnu' });
            setDonneesFormulaire(prev => ({
                ...prev,
                tuteurNom: 'Inconnu Inconnu'
            }));
        }

        axios.get('http://localhost:8080/api/stagiaires', {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => setStagiaires(response.data))
            .catch(error => console.error('Erreur lors de la récupération des stagiaires:', error));
    }, [location]);

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
        if (name === 'nomStagiaire') {
            const selectedStagiaire = stagiaires.find(stagiaire => `${stagiaire.prenom} ${stagiaire.nom}` === value);
            setSelectedStagiaireCin(selectedStagiaire ? selectedStagiaire.cin : '');
        }
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

    const gererSoumission = async (e) => {
        e.preventDefault();
        if (!donneesFormulaire.nomStagiaire || !donneesFormulaire.nomEntreprise || !donneesFormulaire.dateDebut || !donneesFormulaire.dateFin) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (!selectedStagiaireCin || selectedStagiaireCin === '') {
            alert('Veuillez sélectionner un stagiaire.');
            return;
        }
        if (!location.state?.tuteur?.username || location.state.tuteur.username === 'Inconnu') {
            alert('Le CIN du tuteur est invalide. Vérifiez les données du tuteur. Username dans location.state.tuteur: ' + (location.state?.tuteur?.username || 'non défini'));
            return;
        }

        try {
            // Ajuster la structure de stageData pour correspondre à l'API
            const stageData = {
                description: donneesFormulaire.descriptionStage,
                objectif: donneesFormulaire.objectifStage,
                entreprise: donneesFormulaire.nomEntreprise
            };
            console.log('Valeurs saisies dans le formulaire:', {
                description: donneesFormulaire.descriptionStage,
                objectif: donneesFormulaire.objectifStage,
                entreprise: donneesFormulaire.nomEntreprise
            });
            console.log('Envoi des données stage:', stageData);
            const stageResponse = await axios.post('http://localhost:8080/api/stages', stageData, {
                headers: { 'Content-Type': 'application/json' }
            });
            const stageId = stageResponse.data.id;
            console.log('Stage créé avec ID:', stageId);
            console.log('Réponse de l\'API stages:', stageResponse.data);

            if (!stageId) {
                throw new Error('La création du stage a échoué, stage ID non défini.');
            }

            const periodeData = {
                stagiaire: { cin: selectedStagiaireCin },
                tuteur: { cin: location.state.tuteur.username },
                stage: { id: stageId },
                dateDebut: donneesFormulaire.dateDebut,
                dateFin: donneesFormulaire.dateFin
            };
            console.log('Envoi des données période:', periodeData);
            const periodeResponse = await axios.post('http://localhost:8080/api/periodes', periodeData, {
                headers: { 'Content-Type': 'application/json' }
            });
            const periodeId = periodeResponse.data.id;
            console.log('Période créée avec ID:', periodeId);

            const donneesSoumission = {
                appreciationGlobale: {
                    idPeriode: periodeId,
                    implication: parseInt(donneesFormulaire.appreciationGlobale.implication),
                    ouverture: parseInt(donneesFormulaire.appreciationGlobale.ouverture),
                    qualiteProductions: parseInt(donneesFormulaire.appreciationGlobale.qualiteProductions),
                    observations: donneesFormulaire.appreciationGlobale.observations
                },
                competenceEtudiant: {
                    periode: { id: periodeId },
                    analyseSynthese: parseInt(donneesFormulaire.competenceEtudiant.analyseSynthese),
                    autoEvaluation: parseInt(donneesFormulaire.competenceEtudiant.autoEvaluation),
                    contexteInternational: parseInt(donneesFormulaire.competenceEtudiant.contexteInternational),
                    faireAdhererActeurs: parseInt(donneesFormulaire.competenceEtudiant.faireAdhererActeurs),
                    identifierProblemes: parseInt(donneesFormulaire.competenceEtudiant.identifierProblemes),
                    methodesAxesTravail: parseInt(donneesFormulaire.competenceEtudiant.methodesAxesTravail),
                    noteGlobale: parseFloat(donneesFormulaire.competenceEtudiant.noteGlobale)
                },
                competenceEntreprise: {
                    periode: { id: periodeId },
                    fonctionnementEntreprise: parseInt(donneesFormulaire.competenceEntreprise.fonctionnementEntreprise),
                    politiqueEnvironnementale: parseInt(donneesFormulaire.competenceEntreprise.politiqueEnvironnementale),
                    rechercheInformation: parseInt(donneesFormulaire.competenceEntreprise.rechercheInformation),
                    demarcheProjet: parseInt(donneesFormulaire.competenceEntreprise.demarcheProjet),
                    noteGlobale: parseFloat(donneesFormulaire.competenceEntreprise.noteGlobale)
                },
                competenceScientifiqueTechnique: {
                    periode: { id: periodeId },
                    conceptionPreliminaire: parseInt(donneesFormulaire.competenceScientifiqueTechnique.conceptionPreliminaire),
                    noteGlobale: parseFloat(donneesFormulaire.competenceScientifiqueTechnique.noteGlobale)
                },
                competencesSpecifiques: donneesFormulaire.competencesSpecifiques
                    .filter(comp => comp.competence && comp.evaluation !== null)
                    .map(comp => ({
                        periode: { id: periodeId },
                        competence: comp.competence,
                        evaluation: parseInt(comp.evaluation)
                    }))
            };

            console.log('Envoi des appréciations:', donneesSoumission.appreciationGlobale);
            await axios.post('http://localhost:8080/api/appreciations', donneesSoumission.appreciationGlobale, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Envoi des compétences étudiant:', donneesSoumission.competenceEtudiant);
            await axios.post('http://localhost:8080/api/competences-etudiant', donneesSoumission.competenceEtudiant, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Envoi des compétences entreprise:', donneesSoumission.competenceEntreprise);
            await axios.post('http://localhost:8080/api/competences-entreprise', donneesSoumission.competenceEntreprise, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Envoi des compétences scientifiques:', donneesSoumission.competenceScientifiqueTechnique);
            await axios.post('http://localhost:8080/api/competences-scientifiques', donneesSoumission.competenceScientifiqueTechnique, {
                headers: { 'Content-Type': 'application/json' }
            });

            for (const comp of donneesSoumission.competencesSpecifiques) {
                console.log('Envoi compétence spécifique:', comp);
                await axios.post('http://localhost:8080/api/competences-specifiques', comp, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            alert('Évaluation soumise avec succès !');
        } catch (error) {
            console.error('Erreur détaillée:', error.response ? error.response.data : error.message);
            alert(`Une erreur est survenue: ${error.response ? error.response.data.message || error.message : error.message}`);
        }
    };

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

    const niveauxCompetence = [
        { value: 0, label: 'NA' },
        { value: 1, label: 'DÉBUTANT' },
        { value: 2, label: 'AUTONOME' },
        { value: 3, label: 'AUTONOME +' }
    ];

    const niveauxCompetenceSpecifique = [
        { value: 1, label: 'DÉBUTANT' },
        { value: 2, label: 'AUTONOME' },
        { value: 3, label: 'AUTONOME +' }
    ];

    return (
        <div className="container my-5">
            <h1 className="mb-4 text-center">Formulaire d'Évaluation de Stage</h1>
            <form onSubmit={gererSoumission}>
                <div className="mb-4">
                    <h3>Informations du Stage</h3>
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-label">NOM et Prénom du stagiaire</label>
                            <select
                                className="form-select"
                                name="nomStagiaire"
                                value={donneesFormulaire.nomStagiaire}
                                onChange={gererChangementPrincipal}
                                required
                            >
                                <option value="">Sélectionner un stagiaire</option>
                                {stagiaires.map(stagiaire => (
                                    <option key={stagiaire.cin} value={`${stagiaire.prenom} ${stagiaire.nom}`}>
                                        {stagiaire.prenom} {stagiaire.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Nom de l’entreprise</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nomEntreprise"
                                value={donneesFormulaire.nomEntreprise}
                                onChange={gererChangementPrincipal}
                                required
                            />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <label className="form-label">NOM et Prénom du tuteur</label>
                            <input
                                type="text"
                                className="form-control"
                                name="tuteurNom"
                                value={donneesFormulaire.tuteurNom}
                                readOnly
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Période du stage</label>
                            <div className="row">
                                <div className="col">
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dateDebut"
                                        value={donneesFormulaire.dateDebut}
                                        onChange={gererChangementPrincipal}
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dateFin"
                                        value={donneesFormulaire.dateFin}
                                        onChange={gererChangementPrincipal}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <label className="form-label">Description du stage</label>
                            <textarea
                                className="form-control"
                                name="descriptionStage"
                                value={donneesFormulaire.descriptionStage}
                                onChange={gererChangementPrincipal}
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Objectif du stage</label>
                            <textarea
                                className="form-control"
                                name="objectifStage"
                                value={donneesFormulaire.objectifStage}
                                onChange={gererChangementPrincipal}
                                rows="4"
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="accordion" id="accordéonÉvaluation">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUn">
                                Appréciations Générales
                            </button>
                        </h2>
                        <div id="collapseUn" className="accordion-collapse collapse show" data-bs-parent="#accordéonÉvaluation">
                            <div className="accordion-body">
                                <div className="mb-3">
                                    <label className="form-label">Implication</label>
                                    <div>
                                        {optionsImplication.map(option => (
                                            <div className="form-check form-check-inline" key={option.value}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="implication"
                                                    value={option.value}
                                                    checked={donneesFormulaire.appreciationGlobale.implication === option.value}
                                                    onChange={(e) => gererChangement('appreciationGlobale', 'implication', parseInt(e.target.value))}
                                                />
                                                <label className="form-check-label">{option.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Ouverture aux Autres</label>
                                    <div>
                                        {optionsOuverture.map(option => (
                                            <div className="form-check form-check-inline" key={option.value}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="ouverture"
                                                    value={option.value}
                                                    checked={donneesFormulaire.appreciationGlobale.ouverture === option.value}
                                                    onChange={(e) => gererChangement('appreciationGlobale', 'ouverture', parseInt(e.target.value))}
                                                />
                                                <label className="form-check-label">{option.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Qualité des Productions</label>
                                    <div>
                                        {optionsQualite.map(option => (
                                            <div className="form-check form-check-inline" key={option.value}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="qualiteProductions"
                                                    value={option.value}
                                                    checked={donneesFormulaire.appreciationGlobale.qualiteProductions === option.value}
                                                    onChange={(e) => gererChangement('appreciationGlobale', 'qualiteProductions', parseInt(e.target.value))}
                                                />
                                                <label className="form-check-label">{option.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Observations</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={donneesFormulaire.appreciationGlobale.observations}
                                        onChange={(e) => gererChangement('appreciationGlobale', 'observations', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDeux">
                                Compétences Individuelles
                            </button>
                        </h2>
                        <div id="collapseDeux" className="accordion-collapse collapse" data-bs-parent="#accordéonÉvaluation">
                            <div className="accordion-body">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Compétence</th>
                                            <th>NA</th>
                                            <th>DÉBUTANT</th>
                                            <th>AUTONOME</th>
                                            <th>AUTONOME +</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { label: 'Analyse et Synthèse', field: 'analyseSynthese' },
                                            { label: 'Auto-Évaluation', field: 'autoEvaluation' },
                                            { label: 'Contexte International', field: 'contexteInternational' },
                                            { label: 'Faire Adhérer les Acteurs', field: 'faireAdhererActeurs' },
                                            { label: 'Identifier les Problèmes', field: 'identifierProblemes' },
                                            { label: 'Méthodes et Axes de Travail', field: 'methodesAxesTravail' }
                                        ].map(({ label, field }) => (
                                            <tr key={field}>
                                                <td>{label}</td>
                                                {niveauxCompetence.map(niveau => (
                                                    <td key={niveau.value}>
                                                        <input
                                                            type="radio"
                                                            name={field}
                                                            value={niveau.value}
                                                            checked={donneesFormulaire.competenceEtudiant[field] === niveau.value}
                                                            onChange={(e) => gererChangement('competenceEtudiant', field, parseInt(e.target.value))}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mb-3">
                                    <label className="form-label">Note Globale (/20)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        max="20"
                                        step="0.1"
                                        value={donneesFormulaire.competenceEtudiant.noteGlobale}
                                        onChange={(e) => gererChangement('competenceEtudiant', 'noteGlobale', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTrois">
                                Compétences de l'Entreprise
                            </button>
                        </h2>
                        <div id="collapseTrois" className="accordion-collapse collapse" data-bs-parent="#accordéonÉvaluation">
                            <div className="accordion-body">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Compétence</th>
                                            <th>NA</th>
                                            <th>DÉBUTANT</th>
                                            <th>AUTONOME</th>
                                            <th>AUTONOME +</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { label: 'Analyser le Fonctionnement de l’Entreprise', field: 'fonctionnementEntreprise' },
                                            { label: 'Comprendre la Politique Environnementale', field: 'politiqueEnvironnementale' },
                                            { label: 'Rechercher et Sélectionner l’Information', field: 'rechercheInformation' },
                                            { label: 'Démarche Projet', field: 'demarcheProjet' }
                                        ].map(({ label, field }) => (
                                            <tr key={field}>
                                                <td>{label}</td>
                                                {niveauxCompetence.map(niveau => (
                                                    <td key={niveau.value}>
                                                        <input
                                                            type="radio"
                                                            name={field}
                                                            value={niveau.value}
                                                            checked={donneesFormulaire.competenceEntreprise[field] === niveau.value}
                                                            onChange={(e) => gererChangement('competenceEntreprise', field, parseInt(e.target.value))}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mb-3">
                                    <label className="form-label">Note Globale (/20)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        max="20"
                                        step="0.1"
                                        value={donneesFormulaire.competenceEntreprise.noteGlobale}
                                        onChange={(e) => gererChangement('competenceEntreprise', 'noteGlobale', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseQuatre">
                                Compétences Scientifiques et Techniques
                            </button>
                        </h2>
                        <div id="collapseQuatre" className="accordion-collapse collapse" data-bs-parent="#accordéonÉvaluation">
                            <div className="accordion-body">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Compétence</th>
                                            <th>NA</th>
                                            <th>DÉBUTANT</th>
                                            <th>AUTONOME</th>
                                            <th>AUTONOME +</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Conception Préliminaire</td>
                                            {niveauxCompetence.map(niveau => (
                                                <td key={niveau.value}>
                                                    <input
                                                        type="radio"
                                                        name="conceptionPreliminaire"
                                                        value={niveau.value}
                                                        checked={donneesFormulaire.competenceScientifiqueTechnique.conceptionPreliminaire === niveau.value}
                                                        onChange={(e) => gererChangement('competenceScientifiqueTechnique', 'conceptionPreliminaire', parseInt(e.target.value))}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="mb-3">
                                    <label className="form-label">Note Globale (/20)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        max="20"
                                        step="0.1"
                                        value={donneesFormulaire.competenceScientifiqueTechnique.noteGlobale}
                                        onChange={(e) => gererChangement('competenceScientifiqueTechnique', 'noteGlobale', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCinq">
                                Compétences Spécifiques
                            </button>
                        </h2>
                        <div id="collapseCinq" className="accordion-collapse collapse" data-bs-parent="#accordéonÉvaluation">
                            <div className="accordion-body">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Compétence</th>
                                            <th>DÉBUTANT</th>
                                            <th>AUTONOME</th>
                                            <th>AUTONOME +</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donneesFormulaire.competencesSpecifiques.map((comp, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={comp.competence}
                                                        onChange={(e) => gererChangementCompetenceSpecifique(index, 'competence', e.target.value)}
                                                        placeholder={`Compétence ${index + 1}`}
                                                    />
                                                </td>
                                                {niveauxCompetenceSpecifique.map(niveau => (
                                                    <td key={niveau.value}>
                                                        <input
                                                            type="radio"
                                                            name={`competenceSpecifique${index}`}
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
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary">Soumettre l'Évaluation</button>
                </div>
            </form>
        </div>
    );
};

export default FormulaireEvaluation;