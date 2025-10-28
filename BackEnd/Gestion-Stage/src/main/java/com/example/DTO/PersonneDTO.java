package com.example.DTO;


public class PersonneDTO {

    private String cin;
    private String nom;
    private String prenom;
    private String email;

    public PersonneDTO() {}

    public PersonneDTO(String cin, String nom, String prenom, String email) {
        this.cin = cin;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

