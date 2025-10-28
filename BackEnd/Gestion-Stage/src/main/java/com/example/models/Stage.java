package com.example.models;

import jakarta.persistence.*;

@Entity
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String description;
    
    private String objectif;
    
    private String entreprise;

    public Stage() {}

    public Stage(Integer id, String description, String objectif, String entreprise) {
        this.id = id;
        this.description = description;
        this.objectif = objectif;
        this.entreprise = entreprise;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectif() {
        return objectif;
    }

    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }
}
