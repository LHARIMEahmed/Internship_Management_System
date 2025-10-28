package com.example.models;

import jakarta.persistence.*;

@Entity
public class CompetenceScientifiqueTechnique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "idPeriode", nullable = false)
    private Periode periode;

    private Integer conceptionPreliminaire;
    
    private Double noteGlobale;

    public CompetenceScientifiqueTechnique() {}

    public CompetenceScientifiqueTechnique(Integer id, Periode periode, Integer conceptionPreliminaire, Double noteGlobale) {
        this.id = id;
        this.periode = periode;
        this.conceptionPreliminaire = conceptionPreliminaire;
        this.noteGlobale = noteGlobale;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Periode getPeriode() {
        return periode;
    }

    public void setPeriode(Periode periode) {
        this.periode = periode;
    }

    public Integer getConceptionPreliminaire() {
        return conceptionPreliminaire;
    }

    public void setConceptionPreliminaire(Integer conceptionPreliminaire) {
        this.conceptionPreliminaire = conceptionPreliminaire;
    }

    public Double getNoteGlobale() {
        return noteGlobale;
    }

    public void setNoteGlobale(Double noteGlobale) {
        this.noteGlobale = noteGlobale;
    }
}

