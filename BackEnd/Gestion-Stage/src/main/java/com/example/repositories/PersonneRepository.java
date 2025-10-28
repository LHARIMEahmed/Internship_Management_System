package com.example.repositories;


import com.example.models.Personne;

import org.springframework.data.jpa.repository.JpaRepository;


public interface PersonneRepository extends JpaRepository<Personne, String> {
}
