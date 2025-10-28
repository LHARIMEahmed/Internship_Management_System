// evaluationService.js
import axios from 'axios';

// Configurer Axios avec des intercepteurs pour gérer les problèmes d'authentification
axios.interceptors.response.use(
  response => response,
  error => {
    // Intercepter les erreurs 401 (Unauthorized) et 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Erreur d'authentification:", error.response.status);
      // Rediriger vers la page de connexion si le token est expiré
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour créer les headers d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error("Aucun token d'authentification trouvé !");
    // Si on est en production, rediriger vers la page de connexion
    if (process.env.NODE_ENV === 'production') {
      window.location.href = '/login?session=expired';
    }
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Fonction utilitaire pour obtenir l'identifiant du tuteur à partir du token ou des données utilisateur
const getTuteurId = () => {
  // Essayer d'abord de récupérer depuis userData dans localStorage
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.username) {
      console.log("ID tuteur trouvé dans userData:", userData.username);
      return userData.username;
    }
  } catch (e) {
    console.error("Erreur lors de la récupération des données utilisateur:", e);
  }
  
  // Si userData ne fonctionne pas, essayer d'extraire du token JWT
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const userInfo = JSON.parse(jsonPayload);
      console.log("ID tuteur extrait du token:", userInfo.sub);
      return userInfo.sub;
    } catch (e) {
      console.error("Erreur lors du décodage du token:", e);
    }
  }
  
  throw new Error("Impossible de déterminer l'identifiant du tuteur. Veuillez vous reconnecter.");
};

// Récupérer les données de l'évaluation
export const fetchEvaluationData = async (periodeId, setDonneesFormulaire, setLoading, setError, currentUser) => {
    try {
        setLoading(true);
        console.log("Début de la récupération des données pour la période:", periodeId);
        console.log("Token d'authentification:", localStorage.getItem('authToken'));
        
        // Récupérer les informations de la période
        const periodeResponse = await axios.get(`http://localhost:8080/api/periodes/${periodeId}`, {
            headers: getAuthHeaders()
        });
        
        const periodeData = periodeResponse.data;
        console.log("Données de période récupérées:", periodeData);
        
        // Récupérer l'appréciation globale
        const appreciationResponse = await axios.get(`http://localhost:8080/api/appreciations/by-periode/${periodeId}`, {
            headers: getAuthHeaders()
        }).catch(err => {
            console.log("Aucune appréciation trouvée ou erreur:", err);
            return { data: null };
        });
        
        // Récupérer les compétences étudiant
        const compEtudiantResponse = await axios.get(`http://localhost:8080/api/competences-etudiant/by-periode/${periodeId}`, {
            headers: getAuthHeaders()
        }).catch(err => {
            console.log("Aucune compétence étudiant trouvée ou erreur:", err);
            return { data: null };
        });
        
        // Récupérer les compétences entreprise
        const compEntrepriseResponse = await axios.get(`http://localhost:8080/api/competences-entreprise/by-periode/${periodeId}`, {
            headers: getAuthHeaders()
        }).catch(err => {
            console.log("Aucune compétence entreprise trouvée ou erreur:", err);
            return { data: null };
        });
        
        // Récupérer les compétences scientifiques
        const compScientifiqueResponse = await axios.get(`http://localhost:8080/api/competences-scientifiques/by-periode/${periodeId}`, {
            headers: getAuthHeaders()
        }).catch(err => {
            console.log("Aucune compétence scientifique trouvée ou erreur:", err);
            return { data: null };
        });
        
        // Récupérer les compétences spécifiques
        const compSpecifiquesResponse = await axios.get(`http://localhost:8080/api/competences-specifiques/by-periode/${periodeId}`, {
            headers: getAuthHeaders()
        }).catch(err => {
            console.log("Aucune compétence spécifique trouvée ou erreur:", err);
            return { data: [] };
        });
        
        // Vérifier que le tuteur actuel est bien associé à cette période
        if (currentUser && periodeData.tuteur && periodeData.tuteur.cin !== currentUser.username) {
            console.error("L'utilisateur n'est pas autorisé à modifier cette évaluation");
            setError("Vous n'êtes pas autorisé à modifier cette évaluation.");
            setLoading(false);
            return;
        }
        
        // Préparer les données du formulaire
        const appreciationData = appreciationResponse.data || {};
        const competenceEtudiantData = compEtudiantResponse.data || {};
        const competenceEntrepriseData = compEntrepriseResponse.data || {};
        const competenceScientifiqueData = compScientifiqueResponse.data || {};
        const competencesSpecifiquesData = Array.isArray(compSpecifiquesResponse.data) 
            ? compSpecifiquesResponse.data 
            : [];
        
        // Construire un tableau de 5 compétences spécifiques, en utilisant les existantes et complétant avec des vides
        const competencesSpecifiques = Array(5).fill({ competence: '', evaluation: null });
        competencesSpecifiquesData.forEach((comp, index) => {
            if (index < 5) {
                competencesSpecifiques[index] = {
                    id: comp.id,
                    competence: comp.competence,
                    evaluation: comp.evaluation
                };
            }
        });
        
        // Sauvegarder les valeurs originales pour pouvoir comparer lors de la mise à jour
        const originalData = {
            nomEntreprise: periodeData.stage ? periodeData.stage.entreprise : '',
            descriptionStage: periodeData.stage ? periodeData.stage.description : '',
            objectifStage: periodeData.stage ? periodeData.stage.objectif : '',
            dateDebut: periodeData.dateDebut || '',
            dateFin: periodeData.dateFin || '',
            appreciationGlobale: { ...(appreciationData || {}) },
            competenceEtudiant: { ...(competenceEtudiantData || {}) },
            competenceEntreprise: { ...(competenceEntrepriseData || {}) },
            competenceScientifiqueTechnique: { ...(competenceScientifiqueData || {}) },
            competencesSpecifiques: JSON.parse(JSON.stringify(competencesSpecifiques)) // Deep copy
        };
        
        // Mettre à jour l'état du formulaire avec les données récupérées
        setDonneesFormulaire({
            nomStagiaire: periodeData.stagiaire ? `${periodeData.stagiaire.prenom} ${periodeData.stagiaire.nom}` : '',
            stagiaireId: periodeData.stagiaire ? periodeData.stagiaire.cin : '',
            nomEntreprise: periodeData.stage ? periodeData.stage.entreprise : '',
            descriptionStage: periodeData.stage ? periodeData.stage.description : '',
            objectifStage: periodeData.stage ? periodeData.stage.objectif : '',
            tuteurNom: periodeData.tuteur ? `${periodeData.tuteur.prenom} ${periodeData.tuteur.nom}` : '',
            tuteurId: periodeData.tuteur ? periodeData.tuteur.cin : '',
            dateDebut: periodeData.dateDebut || '',
            dateFin: periodeData.dateFin || '',
            stageId: periodeData.stage ? periodeData.stage.id : null,
            appreciationId: appreciationData.id || null,
            
            appreciationGlobale: {
                implication: appreciationData.implication !== undefined ? appreciationData.implication : null,
                ouverture: appreciationData.ouverture !== undefined ? appreciationData.ouverture : null,
                qualiteProductions: appreciationData.qualiteProductions !== undefined ? appreciationData.qualiteProductions : null,
                observations: appreciationData.observations || ''
            },
            
            competenceEtudiant: {
                id: competenceEtudiantData.id || null,
                analyseSynthese: competenceEtudiantData.analyseSynthese !== undefined ? competenceEtudiantData.analyseSynthese : null,
                autoEvaluation: competenceEtudiantData.autoEvaluation !== undefined ? competenceEtudiantData.autoEvaluation : null,
                contexteInternational: competenceEtudiantData.contexteInternational !== undefined ? competenceEtudiantData.contexteInternational : null,
                faireAdhererActeurs: competenceEtudiantData.faireAdhererActeurs !== undefined ? competenceEtudiantData.faireAdhererActeurs : null,
                identifierProblemes: competenceEtudiantData.identifierProblemes !== undefined ? competenceEtudiantData.identifierProblemes : null,
                methodesAxesTravail: competenceEtudiantData.methodesAxesTravail !== undefined ? competenceEtudiantData.methodesAxesTravail : null,
                noteGlobale: competenceEtudiantData.noteGlobale !== undefined ? competenceEtudiantData.noteGlobale : ''
            },
            
            competenceEntreprise: {
                id: competenceEntrepriseData.id || null,
                fonctionnementEntreprise: competenceEntrepriseData.fonctionnementEntreprise !== undefined ? competenceEntrepriseData.fonctionnementEntreprise : null,
                politiqueEnvironnementale: competenceEntrepriseData.politiqueEnvironnementale !== undefined ? competenceEntrepriseData.politiqueEnvironnementale : null,
                rechercheInformation: competenceEntrepriseData.rechercheInformation !== undefined ? competenceEntrepriseData.rechercheInformation : null,
                demarcheProjet: competenceEntrepriseData.demarcheProjet !== undefined ? competenceEntrepriseData.demarcheProjet : null,
                noteGlobale: competenceEntrepriseData.noteGlobale !== undefined ? competenceEntrepriseData.noteGlobale : ''
            },
            
            competenceScientifiqueTechnique: {
                id: competenceScientifiqueData.id || null,
                conceptionPreliminaire: competenceScientifiqueData.conceptionPreliminaire !== undefined ? competenceScientifiqueData.conceptionPreliminaire : null,
                noteGlobale: competenceScientifiqueData.noteGlobale !== undefined ? competenceScientifiqueData.noteGlobale : ''
            },
            
            competencesSpecifiques,
            originalData // Ajouter les données originales pour la comparaison
        });
        
        console.log("Chargement des données terminé avec succès");
        setLoading(false);
    } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        
        // Gestion spécifique des erreurs pour aider le débogage
        if (err.response) {
            // La requête a été faite et le serveur a répondu avec un code d'état
            console.error("Erreur serveur:", err.response.status, err.response.data);
            if (err.response.status === 403) {
                setError("Accès refusé. Vérifiez vos droits d'accès ou reconnectez-vous.");
            } else if (err.response.status === 401) {
                setError("Session expirée. Veuillez vous reconnecter.");
                // Redirection vers la page de connexion après un délai
                setTimeout(() => {
                    window.location.href = '/login?redirect='+encodeURIComponent(window.location.pathname);
                }, 2000);
            } else {
                setError(`Erreur ${err.response.status}: ${err.response.data.message || "Impossible de charger les données"}`);
            }
        } else if (err.request) {
            // La requête a été faite mais aucune réponse n'a été reçue
            console.error("Aucune réponse reçue:", err.request);
            setError("Le serveur ne répond pas. Vérifiez votre connexion réseau.");
        } else {
            // Une erreur s'est produite lors de la configuration de la requête
            console.error("Erreur de configuration:", err.message);
            setError("Une erreur s'est produite lors de la préparation de la requête.");
        }
        
        setLoading(false);
    }
};

// Mettre à jour l'évaluation (uniquement les champs modifiés)
export const updateEvaluation = async (periodeId, donneesFormulaire) => {
    try {
        console.log("Début de la mise à jour pour la période:", periodeId);
        
        // Obtenir l'identifiant du tuteur en utilisant la fonction getTuteurId
        const cinTuteur = getTuteurId();
        const cinStagiaire = donneesFormulaire.stagiaireId;
        
        if (!cinStagiaire) {
            throw new Error("Identifiant du stagiaire manquant");
        }
        
        console.log("Paramètres de mise à jour:", { cinTuteur, cinStagiaire, periodeId });
        
        const originalData = donneesFormulaire.originalData || {};
        
        // Objet pour suivre les requêtes effectuées
        const requestsLog = {
            stage: false,
            periode: false,
            appreciation: false,
            competenceEtudiant: false,
            competenceEntreprise: false,
            competenceScientifique: false,
            competencesSpecifiques: []
        };
        
        // Vérifier si les données du stage ont été modifiées
        const stageModified = donneesFormulaire.nomEntreprise !== originalData.nomEntreprise ||
                              donneesFormulaire.descriptionStage !== originalData.descriptionStage ||
                              donneesFormulaire.objectifStage !== originalData.objectifStage;
                             
        if (stageModified && donneesFormulaire.stageId) {
            const stageData = {
                id: donneesFormulaire.stageId,
                description: donneesFormulaire.descriptionStage || "",  // Assurer qu'aucun champ n'est null
                objectif: donneesFormulaire.objectifStage || "",
                entreprise: donneesFormulaire.nomEntreprise || ""
            };
            
            console.log("Mise à jour du stage:", stageData);
            await axios.put(`http://localhost:8080/api/stages/${donneesFormulaire.stageId}`, stageData, {
                headers: getAuthHeaders()
            });
            requestsLog.stage = true;
        } else {
            console.log("Aucune modification du stage détectée, skip");
        }
        
        // Vérifier si les dates de la période ont été modifiées
        const periodeModified = donneesFormulaire.dateDebut !== originalData.dateDebut ||
                                donneesFormulaire.dateFin !== originalData.dateFin;
                               
        if (periodeModified) {
            const periodeData = {
                id: periodeId,
                stagiaire: { cin: donneesFormulaire.stagiaireId },
                tuteur: { cin: cinTuteur }, // Utiliser l'ID tuteur obtenu
                stage: { id: donneesFormulaire.stageId },
                dateDebut: donneesFormulaire.dateDebut || "",
                dateFin: donneesFormulaire.dateFin || ""
            };
            
            console.log("Mise à jour de la période:", periodeData);
            await axios.put(`http://localhost:8080/api/periodes/${periodeId}`, periodeData, {
                headers: getAuthHeaders()
            });
            requestsLog.periode = true;
        } else {
            console.log("Aucune modification de période détectée, skip");
        }
        
        // Vérifier si l'appréciation globale a été modifiée
        const appreciationModified = donneesFormulaire.appreciationGlobale.implication !== originalData.appreciationGlobale?.implication ||
                                    donneesFormulaire.appreciationGlobale.ouverture !== originalData.appreciationGlobale?.ouverture ||
                                    donneesFormulaire.appreciationGlobale.qualiteProductions !== originalData.appreciationGlobale?.qualiteProductions ||
                                    donneesFormulaire.appreciationGlobale.observations !== originalData.appreciationGlobale?.observations;
        
        if (appreciationModified) {
            // Préparer les données pour la mise à jour de l'appréciation
            const appreciationData = {
                implication: donneesFormulaire.appreciationGlobale.implication !== null ? 
                          parseInt(donneesFormulaire.appreciationGlobale.implication) : null,
                ouverture: donneesFormulaire.appreciationGlobale.ouverture !== null ? 
                          parseInt(donneesFormulaire.appreciationGlobale.ouverture) : null,
                qualiteProductions: donneesFormulaire.appreciationGlobale.qualiteProductions !== null ? 
                                 parseInt(donneesFormulaire.appreciationGlobale.qualiteProductions) : null,
                observations: donneesFormulaire.appreciationGlobale.observations || ''
            };
            
            console.log("Mise à jour de l'appréciation globale via API:", appreciationData);
            await axios.put(
                `http://localhost:8080/api/appreciations/update?cinStagiaire=${cinStagiaire}&cinTuteur=${cinTuteur}&idPeriode=${periodeId}`,
                appreciationData,
                { headers: getAuthHeaders() }
            );
            requestsLog.appreciation = true;
        } else {
            console.log("Aucune modification d'appréciation détectée, skip");
        }
        
        // Fonction pour vérifier si un objet a été modifié
        const hasChanges = (current, original, fields) => {
            // Si l'objet original n'existe pas ou si l'objet actuel n'a pas d'ID mais a des valeurs
            if (!original) return true;
            
            return fields.some(field => current[field] !== original[field]);
        };
        
        // Mettre à jour les compétences étudiant seulement si modifiées
        const competenceEtudiantFields = ['analyseSynthese', 'autoEvaluation', 'contexteInternational', 
                                        'faireAdhererActeurs', 'identifierProblemes', 'methodesAxesTravail', 'noteGlobale'];
                                        
        if (hasChanges(donneesFormulaire.competenceEtudiant, originalData.competenceEtudiant, competenceEtudiantFields)) {
            // Préparer les données pour la mise à jour des compétences étudiant
            const competenceEtudiantData = {
                analyseSynthese: donneesFormulaire.competenceEtudiant.analyseSynthese !== null ? 
                              parseInt(donneesFormulaire.competenceEtudiant.analyseSynthese) : null,
                autoEvaluation: donneesFormulaire.competenceEtudiant.autoEvaluation !== null ? 
                             parseInt(donneesFormulaire.competenceEtudiant.autoEvaluation) : null,
                contexteInternational: donneesFormulaire.competenceEtudiant.contexteInternational !== null ? 
                                   parseInt(donneesFormulaire.competenceEtudiant.contexteInternational) : null,
                faireAdhererActeurs: donneesFormulaire.competenceEtudiant.faireAdhererActeurs !== null ? 
                                  parseInt(donneesFormulaire.competenceEtudiant.faireAdhererActeurs) : null,
                identifierProblemes: donneesFormulaire.competenceEtudiant.identifierProblemes !== null ? 
                                  parseInt(donneesFormulaire.competenceEtudiant.identifierProblemes) : null,
                methodesAxesTravail: donneesFormulaire.competenceEtudiant.methodesAxesTravail !== null ? 
                                  parseInt(donneesFormulaire.competenceEtudiant.methodesAxesTravail) : null,
                noteGlobale: donneesFormulaire.competenceEtudiant.noteGlobale ? 
                           parseFloat(donneesFormulaire.competenceEtudiant.noteGlobale) : null
            };
            
            console.log("Mise à jour des compétences étudiant via API:", competenceEtudiantData);
            await axios.put(
                `http://localhost:8080/api/competences-etudiant/update?cinStagiaire=${cinStagiaire}&cinTuteur=${cinTuteur}&idPeriode=${periodeId}`,
                competenceEtudiantData,
                { headers: getAuthHeaders() }
            );
            requestsLog.competenceEtudiant = true;
        } else {
            console.log("Aucune modification des compétences étudiant détectée, skip");
        }
        
        // Mettre à jour les compétences entreprise seulement si modifiées
        const competenceEntrepriseFields = ['fonctionnementEntreprise', 'politiqueEnvironnementale', 
                                           'rechercheInformation', 'demarcheProjet', 'noteGlobale'];
                                           
        if (hasChanges(donneesFormulaire.competenceEntreprise, originalData.competenceEntreprise, competenceEntrepriseFields)) {
            // Préparer les données pour la mise à jour des compétences entreprise
            const competenceEntrepriseData = {
                fonctionnementEntreprise: donneesFormulaire.competenceEntreprise.fonctionnementEntreprise !== null ? 
                                       parseInt(donneesFormulaire.competenceEntreprise.fonctionnementEntreprise) : null,
                demarcheProjet: donneesFormulaire.competenceEntreprise.demarcheProjet !== null ? 
                             parseInt(donneesFormulaire.competenceEntreprise.demarcheProjet) : null,
                politiqueEnvironnementale: donneesFormulaire.competenceEntreprise.politiqueEnvironnementale !== null ? 
                                        parseInt(donneesFormulaire.competenceEntreprise.politiqueEnvironnementale) : null,
                rechercheInformation: donneesFormulaire.competenceEntreprise.rechercheInformation !== null ? 
                                   parseInt(donneesFormulaire.competenceEntreprise.rechercheInformation) : null,
                noteGlobale: donneesFormulaire.competenceEntreprise.noteGlobale ? 
                           parseFloat(donneesFormulaire.competenceEntreprise.noteGlobale) : null
            };
            
            console.log("Mise à jour des compétences entreprise via API:", competenceEntrepriseData);
            await axios.put(
                `http://localhost:8080/api/competences-entreprise/update?cinStagiaire=${cinStagiaire}&cinTuteur=${cinTuteur}&idPeriode=${periodeId}`,
                competenceEntrepriseData,
                { headers: getAuthHeaders() }
            );
            requestsLog.competenceEntreprise = true;
        } else {
            console.log("Aucune modification des compétences entreprise détectée, skip");
        }
        
        // Mettre à jour les compétences scientifiques seulement si modifiées
        const competenceScientifiqueFields = ['conceptionPreliminaire', 'noteGlobale'];
        
        if (hasChanges(donneesFormulaire.competenceScientifiqueTechnique, originalData.competenceScientifiqueTechnique, competenceScientifiqueFields)) {
            // Préparer les données pour la mise à jour des compétences scientifiques
            const competenceScientifiqueData = {
                conceptionPreliminaire: donneesFormulaire.competenceScientifiqueTechnique.conceptionPreliminaire !== null ? 
                                      parseInt(donneesFormulaire.competenceScientifiqueTechnique.conceptionPreliminaire) : null,
                noteGlobale: donneesFormulaire.competenceScientifiqueTechnique.noteGlobale ? 
                           parseFloat(donneesFormulaire.competenceScientifiqueTechnique.noteGlobale) : null
            };
            
            console.log("Mise à jour des compétences scientifiques via API:", competenceScientifiqueData);
            await axios.put(
                `http://localhost:8080/api/competences-scientifiques/update?cinStagiaire=${cinStagiaire}&cinTuteur=${cinTuteur}&idPeriode=${periodeId}`,
                competenceScientifiqueData,
                { headers: getAuthHeaders() }
            );
            requestsLog.competenceScientifique = true;
        } else {
            console.log("Aucune modification des compétences scientifiques détectée, skip");
        }
        
        // Mettre à jour les compétences spécifiques seulement si modifiées
        // On filtre d'abord pour ne garder que les compétences remplies (avec texte et évaluation)
        const competencesSpecifiquesValides = donneesFormulaire.competencesSpecifiques.filter(
            comp => comp.competence && comp.competence.trim() !== '' && comp.evaluation !== null
        );
        
        console.log("Compétences spécifiques valides:", competencesSpecifiquesValides.length);
        
        // Pour chaque compétence spécifique valide, on la compare avec l'original ou on la crée
        for (let i = 0; i < competencesSpecifiquesValides.length; i++) {
            const comp = competencesSpecifiquesValides[i];
            const originalComp = originalData.competencesSpecifiques[i];
            
            const compModified = !originalComp || 
                              comp.competence !== originalComp.competence ||
                              comp.evaluation !== originalComp.evaluation;
            
            if (compModified) {
                // Préparer les données pour la mise à jour des compétences spécifiques
                const competenceSpecifiqueData = {
                    evaluation: parseInt(comp.evaluation)
                };
                
                console.log(`Mise à jour de la compétence spécifique ${i+1} via API:`, competenceSpecifiqueData);
                await axios.put(
                    `http://localhost:8080/api/competences-specifiques/update?cinStagiaire=${cinStagiaire}&cinTuteur=${cinTuteur}&idPeriode=${periodeId}&nomCompetence=${encodeURIComponent(comp.competence)}`,
                    competenceSpecifiqueData,
                    { headers: getAuthHeaders() }
                );
                requestsLog.competencesSpecifiques.push(i);
            } else {
                console.log(`Aucune modification de la compétence spécifique ${i+1} détectée, skip`);
            }
        }
        
        console.log("Mise à jour terminée avec succès. Actions effectuées:", requestsLog);
        return requestsLog; // Retourner un log des actions effectuées
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        
        // Gestion spécifique des erreurs
        if (error.response) {
            console.error('Détails de l\'erreur serveur:', error.response.data, error.response.status);
            
            // Si l'erreur est un 403, ajouter plus de détails sur le problème possible
            if (error.response.status === 403) {
                throw new Error(`Accès refusé (403): Vous n'avez pas les droits nécessaires pour effectuer cette action. Vérifiez votre session ou contactez l'administrateur.`);
            } else {
                throw new Error(`Erreur ${error.response.status}: ${error.response.data.message || error.response.statusText}`);
            }
        } else if (error.request) {
            console.error('Aucune réponse reçue:', error.request);
            throw new Error("Le serveur ne répond pas à la requête. Vérifiez votre connexion ou contactez l'administrateur.");
        } else {
            console.error('Erreur de configuration:', error.message);
            throw error;
        }
    }
};