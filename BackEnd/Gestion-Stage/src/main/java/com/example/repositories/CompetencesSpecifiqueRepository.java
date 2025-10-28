package com.example.repositories;

import com.example.models.CompetencesSpecifique;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository

public interface CompetencesSpecifiqueRepository extends JpaRepository<CompetencesSpecifique, Integer> {
    List<CompetencesSpecifique> findByPeriodeId(int periodeId);
}