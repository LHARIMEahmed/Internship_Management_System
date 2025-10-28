package com.example.repositories;


import com.example.models.CompetenceEtudiant;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CompetenceEtudiantRepository extends JpaRepository<CompetenceEtudiant, Integer> {
    Optional<CompetenceEtudiant> findByPeriodeId(int periodeId);
    List<CompetenceEtudiant> findByPeriodeIdIn(List<Integer> periodeIds);
}