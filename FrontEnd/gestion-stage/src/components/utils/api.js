import axios from "./axiosConfig"

const API_BASE_URL = 'http://localhost:8080/api';



// Récupération des stagiaires
export const fetchStagiaires = async () => {
  try {
    const response = await axios.get('/api/stagiaires');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des stagiaires:', error);
    throw error;
  }
};

// Création d'un stage
export const createStage = async (stageData) => {
  try {
    const response = await axios.post('/api/stages', stageData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du stage:', error);
    throw error;
  }
};

// Création d'une période
export const createPeriode = async (periodeData) => {
  try {
    const response = await axios.post('/api/periodes', periodeData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la période:', error);
    throw error;
  }
};

// Création d'une appréciation globale
export const createAppreciationGlobale = async (appreciationData) => {
  try {
    const response = await axios.post('/api/appreciations', appreciationData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'appréciation globale:', error);
    throw error;
  }
};

// Création d'une compétence étudiant
export const createCompetenceEtudiant = async (competenceData) => {
  try {
    const response = await axios.post('/api/competences-etudiant', competenceData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la compétence étudiant:', error);
    throw error;
  }
};

// Création d'une compétence entreprise
export const createCompetenceEntreprise = async (competenceData) => {
  try {
    const response = await axios.post('/api/competences-entreprise', competenceData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la compétence entreprise:', error);
    throw error;
  }
};

// Création d'une compétence scientifique
export const createCompetenceScientifique = async (competenceData) => {
  try {
    const response = await axios.post('/api/competences-scientifiques', competenceData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la compétence scientifique:', error);
    throw error;
  }
};

// Création d'une compétence spécifique
export const createCompetenceSpecifique = async (competenceData) => {
  try {
    const response = await axios.post('/api/competences-specifiques', competenceData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la compétence spécifique:', error);
    throw error;
  }
};

// Soumission complète du formulaire d'évaluation
export const submitEvaluation = async (evaluationData) => {
  try {
    // 1. Créer le stage
    const stageResponse = await createStage({
      description: evaluationData.descriptionStage,
      objectif: evaluationData.objectifStage,
      entreprise: evaluationData.nomEntreprise
    });
    const stageId = stageResponse.id;
    
    if (!stageId) {
      throw new Error('La création du stage a échoué, stage ID non défini.');
    }
    
    // 2. Créer la période
    const periodeResponse = await createPeriode({
      stagiaire: { cin: evaluationData.selectedStagiaireCin },
      tuteur: { cin: evaluationData.tuteurCin },
      stage: { id: stageId },
      dateDebut: evaluationData.dateDebut,
      dateFin: evaluationData.dateFin
    });
    const periodeId = periodeResponse.id;
    
    // 3. Créer l'appréciation globale
    await createAppreciationGlobale({
      idPeriode: periodeId,
      implication: parseInt(evaluationData.appreciationGlobale.implication),
      ouverture: parseInt(evaluationData.appreciationGlobale.ouverture),
      qualiteProductions: parseInt(evaluationData.appreciationGlobale.qualiteProductions),
      observations: evaluationData.appreciationGlobale.observations
    });
    
    // 4. Créer la compétence étudiant
    await createCompetenceEtudiant({
      periode: { id: periodeId },
      analyseSynthese: parseInt(evaluationData.competenceEtudiant.analyseSynthese),
      autoEvaluation: parseInt(evaluationData.competenceEtudiant.autoEvaluation),
      contexteInternational: parseInt(evaluationData.competenceEtudiant.contexteInternational),
      faireAdhererActeurs: parseInt(evaluationData.competenceEtudiant.faireAdhererActeurs),
      identifierProblemes: parseInt(evaluationData.competenceEtudiant.identifierProblemes),
      methodesAxesTravail: parseInt(evaluationData.competenceEtudiant.methodesAxesTravail),
      noteGlobale: parseFloat(evaluationData.competenceEtudiant.noteGlobale)
    });
    
    // 5. Créer la compétence entreprise
    await createCompetenceEntreprise({
      periode: { id: periodeId },
      fonctionnementEntreprise: parseInt(evaluationData.competenceEntreprise.fonctionnementEntreprise),
      politiqueEnvironnementale: parseInt(evaluationData.competenceEntreprise.politiqueEnvironnementale),
      rechercheInformation: parseInt(evaluationData.competenceEntreprise.rechercheInformation),
      demarcheProjet: parseInt(evaluationData.competenceEntreprise.demarcheProjet),
      noteGlobale: parseFloat(evaluationData.competenceEntreprise.noteGlobale)
    });
    
    // 6. Créer la compétence scientifique
    await createCompetenceScientifique({
      periode: { id: periodeId },
      conceptionPreliminaire: parseInt(evaluationData.competenceScientifiqueTechnique.conceptionPreliminaire),
      noteGlobale: parseFloat(evaluationData.competenceScientifiqueTechnique.noteGlobale)
    });
    
    // 7. Créer les compétences spécifiques
    const competencesSpecifiques = evaluationData.competencesSpecifiques
      .filter(comp => comp.competence && comp.evaluation !== null);
      
    for (const comp of competencesSpecifiques) {
      await createCompetenceSpecifique({
        periode: { id: periodeId },
        competence: comp.competence,
        evaluation: parseInt(comp.evaluation)
      });
    }
    
    return { success: true, message: 'Évaluation soumise avec succès !' };
  } catch (error) {
    console.error('Erreur détaillée:', error.response ? error.response.data : error.message);
    throw error;
  }
};