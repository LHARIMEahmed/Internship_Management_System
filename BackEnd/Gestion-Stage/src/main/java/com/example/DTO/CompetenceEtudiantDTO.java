package com.example.DTO;

public class CompetenceEtudiantDTO {

    private int id;
    private int idPeriode;
    private Integer analyseSynthese;
    private Integer methodesAxesTravail;
    private Integer faireAdhererActeurs;
    private Integer contexteInternational;
    private Integer autoEvaluation;
    private Integer identifierProblemes;
    private Double noteGlobale;

    public CompetenceEtudiantDTO() {}

    public CompetenceEtudiantDTO(int id, int idPeriode, Integer analyseSynthese, Integer methodesAxesTravail,
                                Integer faireAdhererActeurs, Integer contexteInternational, Integer autoEvaluation,
                                Integer identifierProblemes, Double noteGlobale) {
        this.id = id;
        this.idPeriode = idPeriode;
        this.analyseSynthese = analyseSynthese;
        this.methodesAxesTravail = methodesAxesTravail;
        this.faireAdhererActeurs = faireAdhererActeurs;
        this.contexteInternational = contexteInternational;
        this.autoEvaluation = autoEvaluation;
        this.identifierProblemes = identifierProblemes;
        this.noteGlobale = noteGlobale;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIdPeriode() {
        return idPeriode;
    }

    public void setIdPeriode(int idPeriode) {
        this.idPeriode = idPeriode;
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