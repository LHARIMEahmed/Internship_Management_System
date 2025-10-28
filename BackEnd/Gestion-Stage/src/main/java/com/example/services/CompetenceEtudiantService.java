package com.example.services;

import com.example.models.CompetenceEtudiant;
import com.example.repositories.CompetenceEtudiantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompetenceEtudiantService {

    @Autowired
    private CompetenceEtudiantRepository competenceEtudiantRepository;

    public List<CompetenceEtudiant> getAllCompetences() {
        return competenceEtudiantRepository.findAll();
    }

    public Optional<CompetenceEtudiant> getCompetenceById(int id) {
        return competenceEtudiantRepository.findById(id);
    }

    public CompetenceEtudiant saveCompetence(CompetenceEtudiant competenceEtudiant) {
        return competenceEtudiantRepository.save(competenceEtudiant);
    }

    public void deleteCompetence(int id) {
        competenceEtudiantRepository.deleteById(id);
    }
    public CompetenceEtudiant getCompetenceByPeriodeId(int periodeId) {
        return competenceEtudiantRepository.findByPeriodeId(periodeId)
            .orElse(null);
    }
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void updateCompetenceEtudiant(
            String cinStagiaire,
            String cinTuteur,
            Integer idPeriode,
            Integer analyseSynthese,
            Integer methodesAxesTravail,
            Integer faireAdhererActeurs,
            Integer contexteInternational,
            Integer autoEvaluation,
            Integer identifierProblemes,
            Double noteGlobale) {
        
        String sql = "UPDATE competence_etudiant ce " +
                     "JOIN periode p ON ce.id_periode = p.id " +
                     "SET ce.analyse_synthese = :nouvelle_analyse_synthese, " +
                     "ce.auto_evaluation = :nouvelle_auto_evaluation, " +
                     "ce.contexte_international = :nouveau_contexte_international, " +
                     "ce.faire_adherer_acteurs = :nouveau_faire_adherer_acteurs, " +
                     "ce.identifier_problemes = :nouveau_identifier_problemes, " +
                     "ce.methodes_axes_travail = :nouvelles_methodes_axes_travail, " +
                     "ce.note_globale = :nouvelle_note_globale " +
                     "WHERE p.stagiaire_cin = :cin_stagiaire " +
                     "AND p.tuteur_cin = :cin_tuteur " +
                     "AND p.id = :id_periode";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("nouvelle_analyse_synthese", analyseSynthese);
        query.setParameter("nouvelle_auto_evaluation", autoEvaluation);
        query.setParameter("nouveau_contexte_international", contexteInternational);
        query.setParameter("nouveau_faire_adherer_acteurs", faireAdhererActeurs);
        query.setParameter("nouveau_identifier_problemes", identifierProblemes);
        query.setParameter("nouvelles_methodes_axes_travail", methodesAxesTravail);
        query.setParameter("nouvelle_note_globale", noteGlobale);
        query.setParameter("cin_stagiaire", cinStagiaire);
        query.setParameter("cin_tuteur", cinTuteur);
        query.setParameter("id_periode", idPeriode);
        
        query.executeUpdate();
    }
}
