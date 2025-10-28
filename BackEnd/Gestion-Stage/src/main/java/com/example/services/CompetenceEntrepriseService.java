package com.example.services;

import com.example.models.CompetenceEntreprise;
import com.example.repositories.CompetenceEntrepriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompetenceEntrepriseService {

    @Autowired
    private CompetenceEntrepriseRepository competenceEntrepriseRepository;

    public List<CompetenceEntreprise> getAllCompetences() {
        return competenceEntrepriseRepository.findAll();
    }

    public Optional<CompetenceEntreprise> getCompetenceById(int id) {
        return competenceEntrepriseRepository.findById(id);
    }

    public CompetenceEntreprise saveCompetence(CompetenceEntreprise competenceEntreprise) {
        return competenceEntrepriseRepository.save(competenceEntreprise);
    }

    public void deleteCompetence(int id) {
        competenceEntrepriseRepository.deleteById(id);
    }
    public CompetenceEntreprise getCompetenceByPeriodeId(int periodeId) {
        return competenceEntrepriseRepository.findByPeriodeId(periodeId)
            .orElse(null);
    }
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void updateCompetenceEntreprise(
            String cinStagiaire,
            String cinTuteur,
            Integer idPeriode,
            Integer fonctionnementEntreprise,
            Integer demarcheProjet,
            Integer politiqueEnvironnementale,
            Integer rechercheInformation,
            Double noteGlobale) {
        
        String sql = "UPDATE competence_entreprise ce " +
                     "JOIN periode p ON ce.id_periode = p.id " +
                     "SET ce.demarche_projet = :nouveau_demarche_projet, " +
                     "ce.fonctionnement_entreprise = :nouveau_fonctionnement_entreprise, " +
                     "ce.note_globale = :nouvelle_note_globale, " +
                     "ce.politique_environnementale = :nouvelle_politique_environnementale, " +
                     "ce.recherche_information = :nouvelle_recherche_information " +
                     "WHERE p.stagiaire_cin = :cin_stagiaire " +
                     "AND p.tuteur_cin = :cin_tuteur " +
                     "AND p.id = :id_periode";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("nouveau_demarche_projet", demarcheProjet);
        query.setParameter("nouveau_fonctionnement_entreprise", fonctionnementEntreprise);
        query.setParameter("nouvelle_note_globale", noteGlobale);
        query.setParameter("nouvelle_politique_environnementale", politiqueEnvironnementale);
        query.setParameter("nouvelle_recherche_information", rechercheInformation);
        query.setParameter("cin_stagiaire", cinStagiaire);
        query.setParameter("cin_tuteur", cinTuteur);
        query.setParameter("id_periode", idPeriode);
        
        query.executeUpdate();
    }
}
