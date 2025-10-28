package com.example.repositories;

import com.example.models.AppreciationGlobale;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppreciationGlobaleRepository extends JpaRepository<AppreciationGlobale, Integer> {
    Optional<AppreciationGlobale> findByPeriodeId(int periodeId);
    List<AppreciationGlobale> findByPeriodeIdIn(List<Integer> periodeIds);
}