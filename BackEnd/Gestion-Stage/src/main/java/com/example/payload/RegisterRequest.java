package com.example.payload;

public class RegisterRequest {
    private String username;
    private String password;
    private String role;
    private String nom;
    private String prenom;
    private String email;
    private String institution; // Pour stagiaire
    private String entreprise;  // Pour tuteur
    private String service;     // Pour admin
    
    // Getters et Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    
    public String getEntreprise() { return entreprise; }
    public void setEntreprise(String entreprise) { this.entreprise = entreprise; }
    
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
}