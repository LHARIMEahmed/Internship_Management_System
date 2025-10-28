package com.example.repositories;


import com.example.models.CompetenceEntreprise;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository

public interface CompetenceEntrepriseRepository extends JpaRepository<CompetenceEntreprise, Integer> {
    Optional<CompetenceEntreprise> findByPeriodeId(int periodeId);
    List<CompetenceEntreprise> findByPeriodeIdIn(List<Integer> periodeIds);
}