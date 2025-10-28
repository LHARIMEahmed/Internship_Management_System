package com.example.models;

import jakarta.persistence.*;

@Entity
public class CompetenceEntreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "idPeriode", nullable = false)
    private Periode periode;

    private Integer fonctionnementEntreprise;
    private Integer demarcheProjet;
    private Integer politiqueEnvironnementale;
    private Integer rechercheInformation;
    
    private Double noteGlobale;

    public CompetenceEntreprise() {}

    public CompetenceEntreprise(Integer id, Periode periode, Integer fonctionnementEntreprise, Integer demarcheProjet,
                                 Integer politiqueEnvironnementale, Integer rechercheInformation, Double noteGlobale) {
        this.id = id;
        this.periode = periode;
        this.fonctionnementEntreprise = fonctionnementEntreprise;
        this.demarcheProjet = demarcheProjet;
        this.politiqueEnvironnementale = politiqueEnvironnementale;
        this.rechercheInformation = rechercheInformation;
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

    public Integer getFonctionnementEntreprise() {
        return fonctionnementEntreprise;
    }

    public void setFonctionnementEntreprise(Integer fonctionnementEntreprise) {
        this.fonctionnementEntreprise = fonctionnementEntreprise;
    }

    public Integer getDemarcheProjet() {
        return demarcheProjet;
    }

    public void setDemarcheProjet(Integer demarcheProjet) {
        this.demarcheProjet = demarcheProjet;
    }

    public Integer getPolitiqueEnvironnementale() {
        return politiqueEnvironnementale;
    }

    public void setPolitiqueEnvironnementale(Integer politiqueEnvironnementale) {
        this.politiqueEnvironnementale = politiqueEnvironnementale;
    }

    public Integer getRechercheInformation() {
        return rechercheInformation;
    }

    public void setRechercheInformation(Integer rechercheInformation) {
        this.rechercheInformation = rechercheInformation;
    }

    public Double getNoteGlobale() {
        return noteGlobale;
    }

    public void setNoteGlobale(Double noteGlobale) {
        this.noteGlobale = noteGlobale;
    }
}

