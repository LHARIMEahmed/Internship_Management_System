package com.example.models;
import jakarta.persistence.*;

@Entity
public class Admin extends Personne {
    
    private String service;  // Département ou service administratif
    
    public Admin() {}
    
    public Admin(String cin, String nom, String prenom, String email, String service) {
        super(cin, nom, prenom, email);
        this.service = service;
    }
    
    public String getService() {
        return service;
    }
    
    public void setService(String service) {
        this.service = service;
    }
}