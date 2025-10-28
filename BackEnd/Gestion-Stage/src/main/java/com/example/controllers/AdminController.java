package com.example.controllers;

import com.example.models.*;
import com.example.payload.RegisterRequest;
import com.example.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final StagiaireRepository stagiaireRepository;
    private final TuteurRepository tuteurRepository;
    private final AdminRepository adminRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminController(
            StagiaireRepository stagiaireRepository,
            TuteurRepository tuteurRepository,
            AdminRepository adminRepository,
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder) {
        this.stagiaireRepository = stagiaireRepository;
        this.tuteurRepository = tuteurRepository;
        this.adminRepository = adminRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Récupérer tous les stagiaires
    @GetMapping("/stagiaires")
    public ResponseEntity<List<Stagiaire>> getAllStagiaires() {
        List<Stagiaire> stagiaires = stagiaireRepository.findAll();
        System.out.println("Nombre de stagiaires récupérés: " + stagiaires.size());
        return ResponseEntity.ok(stagiaires);
    }

    // Récupérer tous les tuteurs
    @GetMapping("/tuteurs")
    public ResponseEntity<List<Tuteur>> getAllTuteurs() {
        List<Tuteur> tuteurs = tuteurRepository.findAll();
        System.out.println("Nombre de tuteurs récupérés: " + tuteurs.size());
        return ResponseEntity.ok(tuteurs);
    }
    
    // Récupérer tous les administrateurs
    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        try {
            List<Admin> admins = adminRepository.findAll();
            System.out.println("Nombre d'admins récupérés: " + admins.size());
            // Logger chaque admin récupéré pour déboguer
            for (Admin admin : admins) {
                System.out.println("Admin: " + admin.getCin() + " - " + admin.getNom() + " " + admin.getPrenom());
            }
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des admins: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Supprimer un utilisateur
    @DeleteMapping("/utilisateurs/{username}")
    public ResponseEntity<?> deleteUtilisateur(@PathVariable String username) {
        if (!utilisateurRepository.existsByUsername(username)) {
            return ResponseEntity.notFound().build();
        }

        Utilisateur utilisateur = utilisateurRepository.findByUsername(username);
        String role = utilisateur.getRole();

        // Supprimer l'entrée correspondante dans la table spécifique au rôle
        if ("ROLE_STAGIAIRE".equalsIgnoreCase(role)) {
            stagiaireRepository.deleteById(username);
        } else if ("ROLE_TUTEUR".equalsIgnoreCase(role)) {
            tuteurRepository.deleteById(username);
        } else if ("ROLE_ADMIN".equalsIgnoreCase(role)) {
            adminRepository.deleteById(username);
        }

        // Supprimer l'utilisateur
        utilisateurRepository.deleteById(username);
        System.out.println("Utilisateur supprimé: " + username);

        return ResponseEntity.ok("Utilisateur supprimé avec succès");
    }
    
    // Mettre à jour un utilisateur
    @PutMapping("/utilisateurs/{username}")
    public ResponseEntity<?> updateUtilisateur(@PathVariable String username, @RequestBody RegisterRequest updateRequest) {
        try {
            if (!utilisateurRepository.existsByUsername(username)) {
                return ResponseEntity.notFound().build();
            }
            
            Utilisateur utilisateur = utilisateurRepository.findByUsername(username);
            System.out.println("Mise à jour de l'utilisateur: " + username + " (rôle actuel: " + utilisateur.getRole() + 
                              ", nouveau rôle: " + updateRequest.getRole() + ")");
            
            // Mettre à jour le mot de passe uniquement s'il est fourni
            if (updateRequest.getPassword() != null && !updateRequest.getPassword().trim().isEmpty()) {
                System.out.println("Mise à jour du mot de passe pour " + username);
                String encodedPassword = passwordEncoder.encode(updateRequest.getPassword());
                utilisateur.setPassword(encodedPassword);
                System.out.println("Mot de passe encodé: " + encodedPassword.substring(0, 10) + "...");
            } else {
                System.out.println("Aucune mise à jour du mot de passe pour " + username);
            }
            
            // Si le rôle a changé, gérer le changement de rôle
            if (!utilisateur.getRole().equals(updateRequest.getRole())) {
                // Suppression de l'ancienne entrée dans la table correspondante
                if ("ROLE_STAGIAIRE".equalsIgnoreCase(utilisateur.getRole())) {
                    stagiaireRepository.deleteById(username);
                } else if ("ROLE_TUTEUR".equalsIgnoreCase(utilisateur.getRole())) {
                    tuteurRepository.deleteById(username);
                } else if ("ROLE_ADMIN".equalsIgnoreCase(utilisateur.getRole())) {
                    adminRepository.deleteById(username);
                }
                
                // Mise à jour du rôle
                utilisateur.setRole(updateRequest.getRole());
                System.out.println("Rôle mis à jour de " + utilisateur.getRole() + " à " + updateRequest.getRole());
            }
            
            utilisateurRepository.save(utilisateur);
            
            // Mise à jour ou création de l'entrée dans la table correspondante
            if ("ROLE_STAGIAIRE".equalsIgnoreCase(updateRequest.getRole())) {
                Stagiaire stagiaire = stagiaireRepository.findByCin(username);
                if (stagiaire == null) {
                    stagiaire = new Stagiaire();
                    stagiaire.setCin(username);
                }
                stagiaire.setNom(updateRequest.getNom());
                stagiaire.setPrenom(updateRequest.getPrenom());
                stagiaire.setEmail(updateRequest.getEmail());
                stagiaire.setInstitution(updateRequest.getInstitution());
                stagiaireRepository.save(stagiaire);
                System.out.println("Stagiaire mis à jour: " + stagiaire.getCin());
            } else if ("ROLE_TUTEUR".equalsIgnoreCase(updateRequest.getRole())) {
                Tuteur tuteur = tuteurRepository.findByCin(username);
                if (tuteur == null) {
                    tuteur = new Tuteur();
                    tuteur.setCin(username);
                }
                tuteur.setNom(updateRequest.getNom());
                tuteur.setPrenom(updateRequest.getPrenom());
                tuteur.setEmail(updateRequest.getEmail());
                tuteur.setEntreprise(updateRequest.getEntreprise());
                tuteurRepository.save(tuteur);
                System.out.println("Tuteur mis à jour: " + tuteur.getCin());
            } else if ("ROLE_ADMIN".equalsIgnoreCase(updateRequest.getRole())) {
                Admin admin = adminRepository.findByCin(username);
                if (admin == null) {
                    admin = new Admin();
                    admin.setCin(username);
                }
                admin.setNom(updateRequest.getNom());
                admin.setPrenom(updateRequest.getPrenom());
                admin.setEmail(updateRequest.getEmail());
                admin.setService(updateRequest.getService());
                adminRepository.save(admin);
                System.out.println("Admin mis à jour: " + admin.getCin());
            }
            
            return ResponseEntity.ok("Utilisateur mis à jour avec succès");
        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    // Autres fonctionnalités administratives comme:
    // - Validation des stages
    // - Gestion des rapports
    // etc.
}