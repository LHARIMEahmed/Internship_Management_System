package com.example.models;

import jakarta.persistence.*;

@Entity
public class AppreciationGlobale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAppreciation;

    @ManyToOne
    @JoinColumn(name = "idPeriode", nullable = false)
    private Periode periode;

    private Integer implication;

    private Integer ouverture;

    private Integer qualiteProductions;

    @Column(columnDefinition = "TEXT")
    private String observations;

    public AppreciationGlobale() {}

    public AppreciationGlobale(Integer idAppreciation, Periode periode, Integer implication, Integer ouverture, Integer qualiteProductions, String observations) {
        this.idAppreciation = idAppreciation;
        this.periode = periode;
        this.implication = implication;
        this.ouverture = ouverture;
        this.qualiteProductions = qualiteProductions;
        this.observations = observations;
    }

    public Integer getIdAppreciation() {
        return idAppreciation;
    }

    public void setIdAppreciation(Integer idAppreciation) {
        this.idAppreciation = idAppreciation;
    }

    public Periode getPeriode() {
        return periode;
    }

    public void setPeriode(Periode periode) {
        this.periode = periode;
    }

    public Integer getImplication() {
        return implication;
    }

    public void setImplication(Integer implication) {
        this.implication = implication;
    }

    public Integer getOuverture() {
        return ouverture;
    }

    public void setOuverture(Integer ouverture) {
        this.ouverture = ouverture;
    }

    public Integer getQualiteProductions() {
        return qualiteProductions;
    }

    public void setQualiteProductions(Integer qualiteProductions) {
        this.qualiteProductions = qualiteProductions;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }
}