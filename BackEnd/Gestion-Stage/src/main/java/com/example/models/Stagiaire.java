package com.example.models;

import jakarta.persistence.*;

@Entity
public class Stagiaire extends Personne {

    private String institution;

    public Stagiaire() {}

    public Stagiaire(String cin, String nom, String prenom, String email, String institution) {
        super(cin, nom, prenom, email);
        this.institution = institution;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }
}

