// Options pour les appréciations générales
export const OPTIONS_IMPLICATION = [
    { value: 1, label: 'Paresseux' },
    { value: 2, label: 'Le juste nécessaire' },
    { value: 3, label: 'Bonne' },
    { value: 4, label: 'Très forte' },
    { value: 5, label: 'Dépasse ses objectifs' }
  ];
  
  export const OPTIONS_OUVERTURE = [
    { value: 1, label: 'Isolé(e) ou en opposition' },
    { value: 2, label: 'Renfermé(e) ou obtus' },
    { value: 3, label: 'Bonne' },
    { value: 4, label: 'Très bonne' },
    { value: 5, label: 'Excellente' }
  ];
  
  export const OPTIONS_QUALITE = [
    { value: 1, label: 'Médiocre' },
    { value: 2, label: 'Acceptable' },
    { value: 3, label: 'Bonne' },
    { value: 4, label: 'Très bonne' },
    { value: 5, label: 'Très professionnelle' }
  ];
  
  // Niveaux de compétence
  export const NIVEAUX_COMPETENCE = [
    { value: 0, label: 'NA' },
    { value: 1, label: 'DÉBUTANT' },
    { value: 2, label: 'AUTONOME' },
    { value: 3, label: 'AUTONOME +' }
  ];
  
  export const NIVEAUX_COMPETENCE_SPECIFIQUE = [
    { value: 1, label: 'DÉBUTANT' },
    { value: 2, label: 'AUTONOME' },
    { value: 3, label: 'AUTONOME +' }
  ];
  
  // Définition des compétences individuelles
  export const COMPETENCES_INDIVIDUELLES = [
    { label: 'Analyse et Synthèse', field: 'analyseSynthese' },
    { label: 'Auto-Évaluation', field: 'autoEvaluation' },
    { label: 'Contexte International', field: 'contexteInternational' },
    { label: 'Faire Adhérer les Acteurs', field: 'faireAdhererActeurs' },
    { label: 'Identifier les Problèmes', field: 'identifierProblemes' },
    { label: 'Méthodes et Axes de Travail', field: 'methodesAxesTravail' }
  ];
  
  // Définition des compétences entreprise
  export const COMPETENCES_ENTREPRISE = [
    { label: 'Analyser le Fonctionnement de l\'Entreprise', field: 'fonctionnementEntreprise' },
    { label: 'Comprendre la Politique Environnementale', field: 'politiqueEnvironnementale' },
    { label: 'Rechercher et Sélectionner l\'Information', field: 'rechercheInformation' },
    { label: 'Démarche Projet', field: 'demarcheProjet' }
  ];
  
  // État initial du formulaire
  export const INITIAL_FORM_STATE = {
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
  };