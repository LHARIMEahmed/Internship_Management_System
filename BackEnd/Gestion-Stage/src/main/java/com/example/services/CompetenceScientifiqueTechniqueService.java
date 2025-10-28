package com.example.services;

import com.example.models.CompetenceScientifiqueTechnique;
import com.example.repositories.CompetenceScientifiqueTechniqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompetenceScientifiqueTechniqueService {

    @Autowired
    private CompetenceScientifiqueTechniqueRepository competenceScientifiqueTechniqueRepository;

    public List<CompetenceScientifiqueTechnique> getAllCompetences() {
        return competenceScientifiqueTechniqueRepository.findAll();
    }

    public Optional<CompetenceScientifiqueTechnique> getCompetenceById(int id) {
        return competenceScientifiqueTechniqueRepository.findById(id);
    }

    public CompetenceScientifiqueTechnique saveCompetence(CompetenceScientifiqueTechnique competence) {
        return competenceScientifiqueTechniqueRepository.save(competence);
    }

    public void deleteCompetence(int id) {
        competenceScientifiqueTechniqueRepository.deleteById(id);
    }
    public CompetenceScientifiqueTechnique getCompetenceByPeriodeId(int periodeId) {
        return competenceScientifiqueTechniqueRepository.findByPeriodeId(periodeId)
            .orElse(null);
    }
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void updateCompetenceScientifiqueTechnique(
            String cinStagiaire,
            String cinTuteur,
            Integer idPeriode,
            Integer conceptionPreliminaire,
            Double noteGlobale) {
        
        String sql = "UPDATE competence_scientifique_technique cst " +
                     "JOIN periode p ON cst.id_periode = p.id " +
                     "SET cst.conception_preliminaire = :nouvelle_conception_preliminaire, " +
                     "cst.note_globale = :nouvelle_note_globale " +
                     "WHERE p.stagiaire_cin = :cin_stagiaire " +
                     "AND p.tuteur_cin = :cin_tuteur " +
                     "AND p.id = :id_periode";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("nouvelle_conception_preliminaire", conceptionPreliminaire);
        query.setParameter("nouvelle_note_globale", noteGlobale);
        query.setParameter("cin_stagiaire", cinStagiaire);
        query.setParameter("cin_tuteur", cinTuteur);
        query.setParameter("id_periode", idPeriode);
        
        query.executeUpdate();
    }
}
