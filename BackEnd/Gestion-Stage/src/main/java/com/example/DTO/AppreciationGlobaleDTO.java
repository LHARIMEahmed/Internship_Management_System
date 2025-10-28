package com.example.DTO;

public class AppreciationGlobaleDTO {

    private Integer idPeriode;
    private Integer implication;
    private Integer ouverture;
    private Integer qualiteProductions;
    private String observations;

    public AppreciationGlobaleDTO() {}

    public AppreciationGlobaleDTO(Integer idPeriode, Integer implication, Integer ouverture, Integer qualiteProductions, String observations) {
        this.idPeriode = idPeriode;
        this.implication = implication;
        this.ouverture = ouverture;
        this.qualiteProductions = qualiteProductions;
        this.observations = observations;
    }

    public Integer getIdPeriode() {
        return idPeriode;
    }

    public void setIdPeriode(Integer idPeriode) {
        this.idPeriode = idPeriode;
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