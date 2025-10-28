package com.example.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Periode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Date dateDebut;

    private Date dateFin;

    @ManyToOne
    @JoinColumn(name = "stagiaire_cin")
    private Stagiaire stagiaire;

    @ManyToOne
    @JoinColumn(name = "tuteur_cin")
    private Tuteur tuteur;

    @ManyToOne
    @JoinColumn(name = "stage_id")
    private Stage stage;

    public Periode() {}

    public Periode(Integer id, Date dateDebut, Date dateFin, Stagiaire stagiaire, Tuteur tuteur, Stage stage) {
        this.id = id;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.stagiaire = stagiaire;
        this.tuteur = tuteur;
        this.stage = stage;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Date getDateFin() {
        return dateFin;
    }

    public void setDateFin(Date dateFin) {
        this.dateFin = dateFin;
    }

    public Stagiaire getStagiaire() {
        return stagiaire;
    }

    public void setStagiaire(Stagiaire stagiaire) {
        this.stagiaire = stagiaire;
    }

    public Tuteur getTuteur() {
        return tuteur;
    }

    public void setTuteur(Tuteur tuteur) {
        this.tuteur = tuteur;
    }

    public Stage getStage() {
        return stage;
    }

    public void setStage(Stage stage) {
        this.stage = stage;
    }
}

