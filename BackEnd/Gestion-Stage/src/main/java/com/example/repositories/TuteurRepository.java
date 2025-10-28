package com.example.repositories;

import com.example.models.Tuteur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TuteurRepository extends JpaRepository<Tuteur, String> {
    Tuteur findByCin(String cin);
}
