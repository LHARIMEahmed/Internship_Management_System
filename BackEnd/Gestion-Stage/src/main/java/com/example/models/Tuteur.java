package com.example.models;
import jakarta.persistence.*;

@Entity
public class Tuteur extends Personne {

    private String entreprise;

    public Tuteur() {}

    public Tuteur(String cin, String nom, String prenom, String email, String entreprise) {
        super(cin, nom, prenom, email);
        this.entreprise = entreprise;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }
}
