import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchStagiaires } from '../components/utils/api';
import { INITIAL_FORM_STATE } from '../components/utils/constants';
import {useAuth} from "../hooks/useAuth"

// Simuler un contexte d'authentification ou utiliser localStorage
const getAuthData = () => {
  const authData = localStorage.getItem('userData');
  console.log('Valeur brute de localStorage userData:', authData);
  return authData ? JSON.parse(authData) : { role: '', nom: 'Inconnu', prenom: 'Inconnu', username: 'Inconnu' };
};

const useFormData = () => {
  const {currentUser} = useAuth()
  // État des données du formulaire
  const [donneesFormulaire, setDonneesFormulaire] = useState(INITIAL_FORM_STATE);
  
  // État des stagiaires disponibles
  const [stagiaires, setStagiaires] = useState([]);
  
  // État du CIN du stagiaire sélectionné
  const [selectedStagiaireCin, setSelectedStagiaireCin] = useState('');
  
  // Récupérer la location pour obtenir les données du tuteur
  const location = useLocation();
  
  // État des données du tuteur
  const [tuteur, setTuteur] = useState({ 
    nom: 'Inconnu', 
    prenom: 'Inconnu', 
    cin: 'Inconnu' 
  });

  // Effet pour charger les données initiales
  useEffect(() => {
    // Récupérer les données d'authentification
    const authData = currentUser
    console.log('Données authData:', authData);
    console.log('Données location.state.tuteur:', location.state?.tuteur);

    // Définir les données du tuteur
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

    // Récupérer la liste des stagiaires
    const loadStagiaires = async () => {
      try {
        const stagiairesList = await fetchStagiaires();
        setStagiaires(stagiairesList);
      } catch (error) {
        console.error('Erreur lors de la récupération des stagiaires:', error);
      }
    };
    
    loadStagiaires();
  }, [location]);

  // Fonction pour gérer les changements dans les sections imbriquées
  const gererChangement = (section, champ, valeur) => {
    setDonneesFormulaire(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [champ]: valeur
      }
    }));
  };

  // Fonction pour gérer les changements des champs principaux
  const gererChangementPrincipal = (e) => {
    const { name, value } = e.target;
    if (name === 'nomStagiaire') {
      const selectedStagiaire = stagiaires.find(stagiaire => `${stagiaire.prenom} ${stagiaire.nom}` === value);
      setSelectedStagiaireCin(selectedStagiaire ? selectedStagiaire.cin : '');
    }
    setDonneesFormulaire(prev => ({ ...prev, [name]: value }));
  };

  // Fonction pour gérer les changements des compétences spécifiques
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

  return {
    donneesFormulaire,
    stagiaires,
    selectedStagiaireCin,
    tuteur : currentUser,
    gererChangement,
    gererChangementPrincipal,
    gererChangementCompetenceSpecifique,
    setDonneesFormulaire
  };
};

export default useFormData;