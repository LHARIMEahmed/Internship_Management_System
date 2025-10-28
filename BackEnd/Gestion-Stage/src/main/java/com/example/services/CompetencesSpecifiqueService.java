package com.example.services;

import com.example.models.CompetencesSpecifique;
import com.example.repositories.CompetencesSpecifiqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompetencesSpecifiqueService {

    @Autowired
    private CompetencesSpecifiqueRepository competencesSpecifiqueRepository;

    public List<CompetencesSpecifique> getAllCompetences() {
        return competencesSpecifiqueRepository.findAll();
    }

    public Optional<CompetencesSpecifique> getCompetenceById(int id) {
        return competencesSpecifiqueRepository.findById(id);
    }

    public CompetencesSpecifique saveCompetence(CompetencesSpecifique competence) {
        return competencesSpecifiqueRepository.save(competence);
    }

    public void deleteCompetence(int id) {
        competencesSpecifiqueRepository.deleteById(id);
    }
    public List<CompetencesSpecifique> getCompetencesByPeriodeId(int periodeId) {
        return competencesSpecifiqueRepository.findByPeriodeId(periodeId);
    }
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void updateCompetenceSpecifique(
            String cinStagiaire,
            String cinTuteur,
            Integer idPeriode,
            String nomCompetence,
            Integer evaluation) {
        
        String sql = "UPDATE competences_specifique cs " +
                     "JOIN periode p ON cs.periode_id = p.id " +
                     "SET cs.evaluation = :nouvelle_evaluation " +
                     "WHERE p.stagiaire_cin = :cin_stagiaire " +
                     "AND p.tuteur_cin = :cin_tuteur " +
                     "AND p.id = :id_periode " +
                     "AND cs.competence = :nom_competence";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("nouvelle_evaluation", evaluation);
        query.setParameter("cin_stagiaire", cinStagiaire);
        query.setParameter("cin_tuteur", cinTuteur);
        query.setParameter("id_periode", idPeriode);
        query.setParameter("nom_competence", nomCompetence);
        
        query.executeUpdate();
    }
}
