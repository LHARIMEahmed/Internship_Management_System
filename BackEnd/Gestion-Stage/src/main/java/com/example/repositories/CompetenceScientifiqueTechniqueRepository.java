package com.example.repositories;


import com.example.models.CompetenceScientifiqueTechnique;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository

public interface CompetenceScientifiqueTechniqueRepository extends JpaRepository<CompetenceScientifiqueTechnique, Integer> {
    Optional<CompetenceScientifiqueTechnique> findByPeriodeId(int periodeId);
    List<CompetenceScientifiqueTechnique> findByPeriodeIdIn(List<Integer> periodeIds);
}