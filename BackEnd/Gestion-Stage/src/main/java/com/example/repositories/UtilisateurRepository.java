package com.example.repositories;

import com.example.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, String> {
	Utilisateur findByUsername(String username);

	boolean existsByUsername(String username);
}
