package com.example.repositories;

import com.example.models.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StagiaireRepository extends JpaRepository<Stagiaire, String> {
    Stagiaire findByCin(String cin);
}
