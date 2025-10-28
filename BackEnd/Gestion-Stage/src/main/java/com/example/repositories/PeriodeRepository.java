package com.example.repositories;

import com.example.models.Periode;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PeriodeRepository extends JpaRepository<Periode, Integer> {
	List<Periode> findByStagiaireCinIn(List<String> stagiaireCins);
    List<Periode> findByStageIdIn(List<Integer> stageIds);
}
