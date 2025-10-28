// src/components/EvaluationPdfGenerator.js
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Fonctions d'aide pour les labels
const getImplicationLabel = (value) => {
  const options = [
    { value: 1, label: 'Paresseux' },
    { value: 2, label: 'Le juste nécessaire' },
    { value: 3, label: 'Bonne' },
    { value: 4, label: 'Très forte' },
    { value: 5, label: 'Dépasse ses objectifs' }
  ];
  return options.find(option => option.value === value)?.label || 'Non évalué';
};

const getOuvertureLabel = (value) => {
  const options = [
    { value: 1, label: 'Isolé(e) ou en opposition' },
    { value: 2, label: 'Renfermé(e) ou obtus' },
    { value: 3, label: 'Bonne' },
    { value: 4, label: 'Très bonne' },
    { value: 5, label: 'Excellente' }
  ];
  return options.find(option => option.value === value)?.label || 'Non évalué';
};

const getQualiteLabel = (value) => {
  const options = [
    { value: 1, label: 'Médiocre' },
    { value: 2, label: 'Acceptable' },
    { value: 3, label: 'Bonne' },
    { value: 4, label: 'Très bonne' },
    { value: 5, label: 'Très professionnelle' }
  ];
  return options.find(option => option.value === value)?.label || 'Non évalué';
};

const getNiveauLabel = (value) => {
  const options = [
    { value: 0, label: 'Non applicable' },
    { value: 1, label: 'Débutant' },
    { value: 2, label: 'Autonome' },
    { value: 3, label: 'Autonome +' }
  ];
  return options.find(option => option.value === value)?.label || 'Non évalué';
};

// Composant pour le bouton de téléchargement du PDF
const EvaluationPdfGenerator = ({ evaluation, periodeData }) => {
  // Vérification des données - Ajouté une vérification plus détaillée
  if (!evaluation || !periodeData) {
    console.error("Données manquantes pour la génération du PDF", { evaluation, periodeData });
    return null;
  }

  // Vérifier si l'évaluation a au moins une section remplie
  const hasEvaluation = 
    evaluation.appreciation || 
    evaluation.competenceEtudiant || 
    evaluation.competenceEntreprise || 
    evaluation.competenceScientifique || 
    (evaluation.competencesSpecifiques && evaluation.competencesSpecifiques.length > 0);
  
  if (!hasEvaluation) {
    return (
      <button 
        className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed"
        disabled
      >
        <i className="bi bi-file-earmark-pdf mr-2"></i>
        Aucune évaluation disponible
      </button>
    );
  }

  // Fonction pour afficher les données dans la console pour le débogage
  const debugData = () => {
    console.log('==== DEBUG EVALUATION ====');
    console.log('Appreciation:', evaluation.appreciation);
    console.log('CompetenceEtudiant:', evaluation.competenceEtudiant);
    console.log('CompetenceEntreprise:', evaluation.competenceEntreprise);
    console.log('CompetenceScientifique:', evaluation.competenceScientifique);
    console.log('CompetencesSpecifiques:', evaluation.competencesSpecifiques);
    console.log('==== FIN DEBUG ====');
  };

  const generatePDF = () => {
    // Afficher les données dans la console pour le débogage
    debugData();

    try {
      // Vérification des données avant génération
      if (!periodeData?.stagiaire?.nom || !periodeData?.stagiaire?.prenom) {
        console.error("Informations du stagiaire manquantes");
        alert("Impossible de générer le PDF : informations du stagiaire manquantes");
        return;
      }

      // Créer une nouvelle instance de jsPDF
      const doc = new jsPDF();
      
      // Définir les couleurs et styles
      const primaryColor = [99, 102, 241]; // indigo-600 RGB
      const secondaryColor = [79, 70, 229]; // indigo-700 RGB
      const textColor = [17, 24, 39]; // gray-900 RGB
      const lightTextColor = [107, 114, 128]; // gray-500 RGB
      
      // Fonction d'aide pour ajouter un titre de section
      const addSectionTitle = (text, y) => {
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.rect(15, y, 180, 10, 'F');
        doc.text(text, 20, y + 7);
        return y + 15;
      };
      
      // Fonction d'aide pour ajouter une ligne de données
      const addDataRow = (label, value, y) => {
        doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
        doc.setFontSize(10);
        doc.text(label, 20, y);
        
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        // Vérifier que value est une chaîne
        const valueStr = String(value || '');
        doc.text(valueStr, 190, y, { align: 'right' });
        
        return y + 7;
      };
      
      // Fonction d'aide pour ajouter une valeur mise en évidence
      const addHighlightedValue = (label, value, y) => {
        doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, y);
        
        // Convertir la valeur en chaîne
        const valueStr = String(value || '');
        
        // Dessiner un fond pour la valeur
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        const valueWidth = doc.getTextWidth(valueStr) + 10;
        doc.roundedRect(190 - valueWidth, y - 5, valueWidth, 7, 1, 1, 'F');
        
        // Ajouter le texte en blanc
        doc.setTextColor(255, 255, 255);
        doc.text(valueStr, 190, y, { align: 'right' });
        
        doc.setFont('helvetica', 'normal');
        return y + 10;
      };
      
      // Fonction d'aide pour ajouter un texte d'observation
      const addObservation = (text, y) => {
        if (!text) return y; // Si pas de texte, retourner la position actuelle
        
        doc.setTextColor(75, 85, 99); // gray-600
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        
        // Découper le texte en lignes pour éviter les débordements
        const lines = doc.splitTextToSize(text, 170);
        doc.text(lines, 20, y);
        
        doc.setFont('helvetica', 'normal');
        return y + (lines.length * 5) + 5;
      };

      // Fonction pour ajouter un en-tête de tableau simple
      const addTableHeader = (y) => {
        // Dessiner un rectangle pour l'en-tête
        doc.setFillColor(244, 244, 245); // gray-100
        doc.rect(20, y, 100, 8, 'F');
        doc.rect(120, y, 60, 8, 'F');
        
        // Texte de l'en-tête
        doc.setTextColor(75, 85, 99); // gray-600
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Compétence', 25, y + 5.5);
        doc.text('Niveau', 150, y + 5.5, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        return y + 8;
      };
      
      // Fonction pour ajouter une ligne de tableau simple
      const addTableRow = (competence, niveau, y, isAlternate = false) => {
        // Dessiner un rectangle pour la ligne
        if (isAlternate) {
          doc.setFillColor(249, 250, 251); // gray-50
        } else {
          doc.setFillColor(255, 255, 255); // white
        }
        doc.rect(20, y, 100, 8, 'F');
        doc.rect(120, y, 60, 8, 'F');
        
        // Texte de la ligne
        doc.setTextColor(17, 24, 39); // gray-900
        doc.setFontSize(10);
        doc.text(competence, 25, y + 5.5);
        doc.text(niveau, 150, y + 5.5, { align: 'center' });
        
        return y + 8;
      };
      
      // Titre principal
      doc.setFontSize(20);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('Évaluation de Stage', 105, 20, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      
      let yPosition = 30;
      
      // Informations générales
      yPosition = addSectionTitle('Informations Générales', yPosition);
      
      // Éviter les erreurs avec le chaînage optionnel et la validation des données
      const stagiaireNom = periodeData?.stagiaire?.nom || '';
      const stagiairePrenom = periodeData?.stagiaire?.prenom || '';
      const entrepriseNom = periodeData?.stage?.entreprise?.nom || periodeData?.stage?.entreprise || 'Non spécifiée';
      const dateDebut = periodeData?.dateDebut ? new Date(periodeData.dateDebut).toLocaleDateString() : 'Non spécifiée';
      const dateFin = periodeData?.dateFin ? new Date(periodeData.dateFin).toLocaleDateString() : 'Non spécifiée';
      
      yPosition = addDataRow('Stagiaire:', `${stagiairePrenom} ${stagiaireNom}`, yPosition);
      yPosition = addDataRow('Entreprise:', entrepriseNom, yPosition);
      yPosition = addDataRow('Période:', `${dateDebut} au ${dateFin}`, yPosition);
      
      // Vérification du tuteur
      if (periodeData?.tuteur?.prenom && periodeData?.tuteur?.nom) {
        yPosition = addDataRow('Tuteur:', `${periodeData.tuteur.prenom} ${periodeData.tuteur.nom}`, yPosition);
      } else {
        yPosition = addDataRow('Tuteur:', 'Non spécifié', yPosition);
      }
      
      yPosition += 5;
      
      // Appréciation Globale
      if (evaluation.appreciation) {
        yPosition = addSectionTitle('Appréciation Globale', yPosition);
        
        // Vérifier que les propriétés existent avant de les utiliser
        if (typeof evaluation.appreciation.implication === 'number') {
          yPosition = addDataRow(`Implication (${evaluation.appreciation.implication}/5):`, 
                               getImplicationLabel(evaluation.appreciation.implication), yPosition);
        }
        
        if (typeof evaluation.appreciation.ouverture === 'number') {
          yPosition = addDataRow(`Ouverture aux Autres (${evaluation.appreciation.ouverture}/5):`, 
                               getOuvertureLabel(evaluation.appreciation.ouverture), yPosition);
        }
        
        if (typeof evaluation.appreciation.qualiteProductions === 'number') {
          yPosition = addDataRow(`Qualité des Productions (${evaluation.appreciation.qualiteProductions}/5):`, 
                               getQualiteLabel(evaluation.appreciation.qualiteProductions), yPosition);
        }
        
        if (evaluation.appreciation.observations) {
          doc.setFontSize(11);
          doc.setTextColor(75, 85, 99); // gray-600
          doc.text('Observations:', 20, yPosition + 5);
          yPosition = addObservation(evaluation.appreciation.observations, yPosition + 10);
        }
        
        yPosition += 5;
      }
      
      // Compétences Individuelles
      if (evaluation.competenceEtudiant) {
        yPosition = addSectionTitle('Compétences Individuelles', yPosition);
        
        let hasCompetences = false;
        
        // Préparation pour afficher les compétences individuelles
        yPosition = addTableHeader(yPosition);
        let rowAlternate = false;
        
        // Vérifier et afficher chaque compétence si elle existe
        if (evaluation.competenceEtudiant.analyseSynthese !== undefined && evaluation.competenceEtudiant.analyseSynthese !== null) {
          yPosition = addTableRow('Analyse et Synthèse', getNiveauLabel(evaluation.competenceEtudiant.analyseSynthese), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (evaluation.competenceEtudiant.autoEvaluation !== undefined && evaluation.competenceEtudiant.autoEvaluation !== null) {
          yPosition = addTableRow('Auto-Évaluation', getNiveauLabel(evaluation.competenceEtudiant.autoEvaluation), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (evaluation.competenceEtudiant.contexteInternational !== undefined && evaluation.competenceEtudiant.contexteInternational !== null) {
          yPosition = addTableRow('Contexte International', getNiveauLabel(evaluation.competenceEtudiant.contexteInternational), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (evaluation.competenceEtudiant.faireAdhererActeurs !== undefined && evaluation.competenceEtudiant.faireAdhererActeurs !== null) {
          yPosition = addTableRow('Faire Adhérer les Acteurs', getNiveauLabel(evaluation.competenceEtudiant.faireAdhererActeurs), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (evaluation.competenceEtudiant.identifierProblemes !== undefined && evaluation.competenceEtudiant.identifierProblemes !== null) {
          yPosition = addTableRow('Identifier les Problèmes', getNiveauLabel(evaluation.competenceEtudiant.identifierProblemes), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (evaluation.competenceEtudiant.methodesAxesTravail !== undefined && evaluation.competenceEtudiant.methodesAxesTravail !== null) {
          yPosition = addTableRow('Méthodes et Axes de Travail', getNiveauLabel(evaluation.competenceEtudiant.methodesAxesTravail), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (!hasCompetences) {
          yPosition = addDataRow('Aucune compétence individuelle disponible', '', yPosition);
        }
        
        yPosition += 5;
        
        // Ajouter la note globale si disponible
        if (evaluation.competenceEtudiant.noteGlobale !== undefined && evaluation.competenceEtudiant.noteGlobale !== null) {
          yPosition = addHighlightedValue('Note Globale:', `${evaluation.competenceEtudiant.noteGlobale}/20`, yPosition);
        }
        
        yPosition += 5;
      }
      
      // Ajouter une nouvelle page si nécessaire
      if (yPosition > 250 && (evaluation.competenceEntreprise || evaluation.competenceScientifique || (evaluation.competencesSpecifiques && evaluation.competencesSpecifiques.length > 0))) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Compétences de l'Entreprise
      if (evaluation.competenceEntreprise) {
        yPosition = addSectionTitle('Compétences de l\'Entreprise', yPosition);
        
        let hasCompetences = false;
        
        // Préparation pour afficher les compétences de l'entreprise
        yPosition = addTableHeader(yPosition);
        let rowAlternate = false;
        
        // Vérifier et afficher chaque compétence si elle existe
        if (evaluation.competenceEntreprise.fonctionnementEntreprise !== undefined && evaluation.competenceEntreprise.fonctionnementEntreprise !== null) {
          yPosition = addTableRow('Analyser le Fonctionnement de l\'Entreprise', getNiveauLabel(evaluation.competenceEntreprise.fonctionnementEntreprise), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (evaluation.competenceEntreprise.politiqueEnvironnementale !== undefined && evaluation.competenceEntreprise.politiqueEnvironnementale !== null) {
          yPosition = addTableRow('Comprendre la Politique Environnementale', getNiveauLabel(evaluation.competenceEntreprise.politiqueEnvironnementale), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (evaluation.competenceEntreprise.rechercheInformation !== undefined && evaluation.competenceEntreprise.rechercheInformation !== null) {
          yPosition = addTableRow('Rechercher et Sélectionner l\'Information', getNiveauLabel(evaluation.competenceEntreprise.rechercheInformation), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (evaluation.competenceEntreprise.demarcheProjet !== undefined && evaluation.competenceEntreprise.demarcheProjet !== null) {
          yPosition = addTableRow('Démarche Projet', getNiveauLabel(evaluation.competenceEntreprise.demarcheProjet), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (!hasCompetences) {
          yPosition = addDataRow('Aucune compétence d\'entreprise disponible', '', yPosition);
        }
        
        yPosition += 5;
        
        // Ajouter la note globale si disponible
        if (evaluation.competenceEntreprise.noteGlobale !== undefined && evaluation.competenceEntreprise.noteGlobale !== null) {
          yPosition = addHighlightedValue('Note Globale:', `${evaluation.competenceEntreprise.noteGlobale}/20`, yPosition);
        }
        
        yPosition += 5;
      }
      
      // Ajouter une nouvelle page si nécessaire
      if (yPosition > 250 && (evaluation.competenceScientifique || (evaluation.competencesSpecifiques && evaluation.competencesSpecifiques.length > 0))) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Compétences Scientifiques et Techniques
      if (evaluation.competenceScientifique) {
        yPosition = addSectionTitle('Compétences Scientifiques et Techniques', yPosition);
        
        let hasCompetences = false;
        
        // Préparation pour afficher les compétences scientifiques
        yPosition = addTableHeader(yPosition);
        let rowAlternate = false;
        
        // Vérifier et afficher chaque compétence si elle existe
        if (evaluation.competenceScientifique.conceptionPreliminaire !== undefined && evaluation.competenceScientifique.conceptionPreliminaire !== null) {
          yPosition = addTableRow('Conception Préliminaire', getNiveauLabel(evaluation.competenceScientifique.conceptionPreliminaire), yPosition, rowAlternate);
          rowAlternate = !rowAlternate;
          hasCompetences = true;
        }
        
        if (!hasCompetences) {
          yPosition = addDataRow('Aucune compétence scientifique disponible', '', yPosition);
        }
        
        yPosition += 5;
        
        // Ajouter la note globale si disponible
        if (evaluation.competenceScientifique.noteGlobale !== undefined && evaluation.competenceScientifique.noteGlobale !== null) {
          yPosition = addHighlightedValue('Note Globale:', `${evaluation.competenceScientifique.noteGlobale}/20`, yPosition);
        }
        
        yPosition += 5;
      }
      
      // Ajouter une nouvelle page si nécessaire
      if (yPosition > 250 && evaluation.competencesSpecifiques && evaluation.competencesSpecifiques.length > 0) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Compétences Spécifiques
      if (evaluation.competencesSpecifiques && evaluation.competencesSpecifiques.length > 0) {
        yPosition = addSectionTitle('Compétences Spécifiques', yPosition);
        
        // S'assurer que competencesSpecifiques est un tableau
        if (Array.isArray(evaluation.competencesSpecifiques)) {
          // Filtrer pour ne garder que les compétences valides
          const validCompetences = evaluation.competencesSpecifiques.filter(
            comp => comp && comp.competence && (comp.evaluation !== undefined && comp.evaluation !== null)
          );
          
          if (validCompetences.length > 0) {
            // Préparation pour afficher les compétences spécifiques
            yPosition = addTableHeader(yPosition);
            let rowAlternate = false;
            
            // Parcourir les compétences spécifiques et les afficher
            validCompetences.forEach(comp => {
              yPosition = addTableRow(comp.competence, getNiveauLabel(comp.evaluation), yPosition, rowAlternate);
              rowAlternate = !rowAlternate;
            });
          } else {
            yPosition = addDataRow('Aucune compétence spécifique disponible', '', yPosition);
          }
        } else {
          yPosition = addDataRow('Aucune compétence spécifique disponible', '', yPosition);
        }
      }
      
      // Pied de page
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175); // gray-400
      doc.text(`Document généré le ${new Date().toLocaleDateString()} - Système de Gestion des Stages`, 105, 285, { align: 'center' });
      
      // Télécharger le PDF
      const filename = `evaluation_stage_${periodeData.stagiaire.nom || 'etudiant'}_${periodeData.stagiaire.prenom || ''}.pdf`;
      doc.save(filename);
      console.log(`PDF généré avec succès: ${filename}`);
      
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.");
    }
  };

  return (
    <button 
      onClick={generatePDF}
      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
    >
      <i className="bi bi-file-earmark-pdf mr-2"></i>
      Télécharger l'évaluation (PDF)
    </button>
  );
};

export default EvaluationPdfGenerator;