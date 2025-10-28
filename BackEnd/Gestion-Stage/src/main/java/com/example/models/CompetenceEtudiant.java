package com.example.models;

import jakarta.persistence.*;

@Entity
public class CompetenceEtudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "idPeriode", nullable = false)
    private Periode periode;

    private Integer analyseSynthese;
    private Integer methodesAxesTravail;
    private Integer faireAdhererActeurs;
    private Integer contexteInternational;
    private Integer autoEvaluation;
    private Integer identifierProblemes;
    
    private Double noteGlobale;

    public CompetenceEtudiant() {}

    public CompetenceEtudiant(Integer id, Periode periode, Integer analyseSynthese, Integer methodesAxesTravail,
                             Integer faireAdhererActeurs, Integer contexteInternational, Integer autoEvaluation,
                             Integer identifierProblemes, Double noteGlobale) {
        this.id = id;
        this.periode = periode;
        this.analyseSynthese = analyseSynthese;
        this.methodesAxesTravail = methodesAxesTravail;
        this.faireAdhererActeurs = faireAdhererActeurs;
        this.contexteInternational = contexteInternational;
        this.autoEvaluation = autoEvaluation;
        this.identifierProblemes = identifierProblemes;
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

    public Integer getAnalyseSynthese() {
        return analyseSynthese;
    }

    public void setAnalyseSynthese(Integer analyseSynthese) {
        this.analyseSynthese = analyseSynthese;
    }

    public Integer getMethodesAxesTravail() {
        return methodesAxesTravail;
    }

    public void setMethodesAxesTravail(Integer methodesAxesTravail) {
        this.methodesAxesTravail = methodesAxesTravail;
    }

    public Integer getFaireAdhererActeurs() {
        return faireAdhererActeurs;
    }

    public void setFaireAdhererActeurs(Integer faireAdhererActeurs) {
        this.faireAdhererActeurs = faireAdhererActeurs;
    }

    public Integer getContexteInternational() {
        return contexteInternational;
    }

    public void setContexteInternational(Integer contexteInternational) {
        this.contexteInternational = contexteInternational;
    }

    public Integer getAutoEvaluation() {
        return autoEvaluation;
    }

    public void setAutoEvaluation(Integer autoEvaluation) {
        this.autoEvaluation = autoEvaluation;
    }

    public Integer getIdentifierProblemes() {
        return identifierProblemes;
    }

    public void setIdentifierProblemes(Integer identifierProblemes) {
        this.identifierProblemes = identifierProblemes;
    }

    public Double getNoteGlobale() {
        return noteGlobale;
    }

    public void setNoteGlobale(Double noteGlobale) {
        this.noteGlobale = noteGlobale;
    }
}