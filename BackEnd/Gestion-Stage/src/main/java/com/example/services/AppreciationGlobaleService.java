package com.example.services;

import com.example.models.AppreciationGlobale;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import com.example.repositories.AppreciationGlobaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class AppreciationGlobaleService {

    @Autowired
    private AppreciationGlobaleRepository appreciationGlobaleRepository;

    public List<AppreciationGlobale> getAllAppreciations() {
        return appreciationGlobaleRepository.findAll();
    }

    public Optional<AppreciationGlobale> getAppreciationById(int id) {
        return appreciationGlobaleRepository.findById(id);
    }

    public AppreciationGlobale saveAppreciation(AppreciationGlobale appreciation) {
        return appreciationGlobaleRepository.save(appreciation);
    }

    public void deleteAppreciation(int id) {
        appreciationGlobaleRepository.deleteById(id);
    }
    public AppreciationGlobale getAppreciationByPeriodeId(int periodeId) {
        return appreciationGlobaleRepository.findByPeriodeId(periodeId)
            .orElse(null); // Retourne null si aucune appréciation n'est trouvée
    }
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void updateAppreciationGlobale(
            String cinStagiaire,
            String cinTuteur,
            Integer idPeriode,
            Integer implication,
            Integer ouverture,
            Integer qualiteProductions,
            String observations) {
        
        String sql = "UPDATE appreciation_globale ag " +
                     "JOIN periode p ON ag.id_periode = p.id " +
                     "SET ag.implication = :nouvelle_implication, " +
                     "ag.observations = :nouvelles_observations, " +
                     "ag.ouverture = :nouvelle_ouverture, " +
                     "ag.qualite_productions = :nouvelle_qualite_productions " +
                     "WHERE p.stagiaire_cin = :cin_stagiaire " +
                     "AND p.tuteur_cin = :cin_tuteur " +
                     "AND p.id = :id_periode";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("nouvelle_implication", implication);
        query.setParameter("nouvelles_observations", observations);
        query.setParameter("nouvelle_ouverture", ouverture);
        query.setParameter("nouvelle_qualite_productions", qualiteProductions);
        query.setParameter("cin_stagiaire", cinStagiaire);
        query.setParameter("cin_tuteur", cinTuteur);
        query.setParameter("id_periode", idPeriode);
        
        query.executeUpdate();
    }
}