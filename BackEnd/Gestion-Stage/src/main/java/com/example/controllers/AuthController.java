package com.example.controllers;

import com.example.models.*;
import com.example.payload.LoginRequest;
import com.example.payload.RegisterRequest;
import com.example.repositories.*;
import com.example.security.JwtService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final StagiaireRepository stagiaireRepository;
    private final TuteurRepository tuteurRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    public AuthController(
            UtilisateurRepository utilisateurRepository,
            StagiaireRepository stagiaireRepository,
            TuteurRepository tuteurRepository,
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.utilisateurRepository = utilisateurRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.tuteurRepository = tuteurRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Tentative de connexion pour: " + loginRequest.getUsername());
            
            // Vérifier d'abord si l'utilisateur existe
            Utilisateur utilisateur = utilisateurRepository.findByUsername(loginRequest.getUsername());
            if (utilisateur == null) {
                System.out.println("Utilisateur non trouvé: " + loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nom d'utilisateur ou mot de passe incorrect");
            }
            
            System.out.println("Rôle de l'utilisateur: " + utilisateur.getRole());
            System.out.println("Début du mot de passe stocké: " + utilisateur.getPassword().substring(0, 10) + "...");
            
            // Vérifier manuellement si le mot de passe correspond (pour diagnostic)
            boolean matches = passwordEncoder.matches(loginRequest.getPassword(), utilisateur.getPassword());
            System.out.println("Vérification manuelle du mot de passe: " + matches);
            
            // Authentifier l'utilisateur
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            // Récupérer les informations de l'utilisateur
            String role = utilisateur.getRole();
            String nom = "";
            String prenom = "";
            
            // Récupérer les informations complémentaires selon le rôle
            if ("ROLE_STAGIAIRE".equalsIgnoreCase(role)) {
                Stagiaire stagiaire = stagiaireRepository.findByCin(utilisateur.getUsername());
                if (stagiaire != null) {
                    nom = stagiaire.getNom();
                    prenom = stagiaire.getPrenom();
                }
            } else if ("ROLE_TUTEUR".equalsIgnoreCase(role)) {
                Tuteur tuteur = tuteurRepository.findByCin(utilisateur.getUsername());
                if (tuteur != null) {
                    nom = tuteur.getNom();
                    prenom = tuteur.getPrenom();
                }
            } else if ("ROLE_ADMIN".equalsIgnoreCase(role)) {
                Admin admin = adminRepository.findByCin(utilisateur.getUsername());
                if (admin != null) {
                    nom = admin.getNom();
                    prenom = admin.getPrenom();
                }
            }
            
            // Générer le token JWT
            String token = jwtService.generateToken(utilisateur.getUsername(), role, nom, prenom);
            
            // Préparer la réponse
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", utilisateur.getUsername());
            response.put("role", role);
            response.put("nom", nom);
            response.put("prenom", prenom);
            
            System.out.println("Authentification réussie pour: " + loginRequest.getUsername());
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            System.err.println("Erreur d'authentification pour " + loginRequest.getUsername() + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nom d'utilisateur ou mot de passe incorrect");
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        // Récupérer l'authentification actuelle
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non authentifié");
        }
        
        // Récupérer le nom d'utilisateur
        String username = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username);
        
        if (utilisateur == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
        }
        
        // Préparer la réponse selon le rôle
        Map<String, Object> response = new HashMap<>();
        response.put("username", utilisateur.getUsername());
        response.put("role", utilisateur.getRole());
        
        if ("ROLE_STAGIAIRE".equalsIgnoreCase(utilisateur.getRole())) {
            Stagiaire stagiaire = stagiaireRepository.findByCin(username);
            if (stagiaire != null) {
                response.put("nom", stagiaire.getNom());
                response.put("prenom", stagiaire.getPrenom());
                response.put("email", stagiaire.getEmail());
                // On pourrait ajouter d'autres informations spécifiques au stagiaire
            }
        } else if ("ROLE_TUTEUR".equalsIgnoreCase(utilisateur.getRole())) {
            Tuteur tuteur = tuteurRepository.findByCin(username);
            if (tuteur != null) {
                response.put("nom", tuteur.getNom());
                response.put("prenom", tuteur.getPrenom());
                response.put("email", tuteur.getEmail());
                // On pourrait ajouter d'autres informations spécifiques au tuteur
            }
        } else if ("ROLE_ADMIN".equalsIgnoreCase(utilisateur.getRole())) {
            Admin admin = adminRepository.findByCin(username);
            if (admin != null) {
                response.put("nom", admin.getNom());
                response.put("prenom", admin.getPrenom());
                response.put("email", admin.getEmail());
                response.put("service", admin.getService());
                // On pourrait ajouter d'autres informations spécifiques à l'admin
            }
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Vérifier si l'utilisateur existe déjà
            if (utilisateurRepository.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity
                        .badRequest()
                        .body("Erreur: Cet utilisateur existe déjà!");
            }

            // Vérifier si le mot de passe est vide
            if (registerRequest.getPassword() == null || registerRequest.getPassword().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Erreur: Le mot de passe ne peut pas être vide!");
            }

            System.out.println("Création d'un utilisateur: " + registerRequest.getUsername() + 
                              " avec rôle: " + registerRequest.getRole());

            // Créer un nouvel utilisateur
            Utilisateur utilisateur = new Utilisateur();
            utilisateur.setUsername(registerRequest.getUsername());
            
            // Encoder le mot de passe
            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
            System.out.println("Mot de passe encodé: " + encodedPassword.substring(0, 10) + "...");
            utilisateur.setPassword(encodedPassword);
            utilisateur.setRole(registerRequest.getRole());
            
            utilisateurRepository.save(utilisateur);
            System.out.println("Utilisateur sauvegardé dans la table Utilisateur");
            
            // Créer le profil correspondant selon le rôle
            if ("ROLE_STAGIAIRE".equalsIgnoreCase(registerRequest.getRole())) {
                Stagiaire stagiaire = new Stagiaire();
                stagiaire.setCin(registerRequest.getUsername());
                stagiaire.setNom(registerRequest.getNom());
                stagiaire.setPrenom(registerRequest.getPrenom());
                stagiaire.setEmail(registerRequest.getEmail());
                stagiaire.setInstitution(registerRequest.getInstitution());
                stagiaireRepository.save(stagiaire);
                System.out.println("Stagiaire sauvegardé");
            } else if ("ROLE_TUTEUR".equalsIgnoreCase(registerRequest.getRole())) {
                Tuteur tuteur = new Tuteur();
                tuteur.setCin(registerRequest.getUsername());
                tuteur.setNom(registerRequest.getNom());
                tuteur.setPrenom(registerRequest.getPrenom());
                tuteur.setEmail(registerRequest.getEmail());
                tuteur.setEntreprise(registerRequest.getEntreprise());
                tuteurRepository.save(tuteur);
                System.out.println("Tuteur sauvegardé");
            } else if ("ROLE_ADMIN".equalsIgnoreCase(registerRequest.getRole())) {
                Admin admin = new Admin();
                admin.setCin(registerRequest.getUsername());
                admin.setNom(registerRequest.getNom());
                admin.setPrenom(registerRequest.getPrenom());
                admin.setEmail(registerRequest.getEmail());
                admin.setService(registerRequest.getService());
                Admin savedAdmin = adminRepository.save(admin);
                System.out.println("Admin sauvegardé: " + savedAdmin.getCin() + " - " + savedAdmin.getNom());
                
                // Vérification supplémentaire pour le débogage
                Admin verifyAdmin = adminRepository.findByCin(registerRequest.getUsername());
                System.out.println("Vérification - Admin trouvé après sauvegarde: " + 
                                  (verifyAdmin != null ? "oui" : "non"));
            }
            
            return ResponseEntity.ok("Utilisateur enregistré avec succès!");
        } catch (Exception e) {
            System.err.println("Erreur lors de l'enregistrement: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Erreur lors de l'enregistrement: " + e.getMessage());
        }
    }
    
    @PostMapping("/reset-password-admin")
    public ResponseEntity<?> resetAdminPassword(@RequestParam String username, @RequestParam String newPassword) {
        if (!utilisateurRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Utilisateur non trouvé");
        }
        
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username);
        if (!"ROLE_ADMIN".equalsIgnoreCase(utilisateur.getRole())) {
            return ResponseEntity.badRequest().body("Cette méthode est réservée aux administrateurs");
        }
        
        String encodedPassword = passwordEncoder.encode(newPassword);
        utilisateur.setPassword(encodedPassword);
        utilisateurRepository.save(utilisateur);
        
        System.out.println("Mot de passe réinitialisé pour l'admin: " + username);
        return ResponseEntity.ok("Mot de passe administrateur réinitialisé avec succès");
    }
}