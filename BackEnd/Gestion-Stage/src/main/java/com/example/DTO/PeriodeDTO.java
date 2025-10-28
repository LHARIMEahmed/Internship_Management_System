package com.example.DTO;

import java.util.Date;

public class PeriodeDTO {

    private int id;
    private Date dateDebut;
    private Date dateFin;
    private String stagiaireCin;
    private String tuteurCin;
    private int stageId;

    public PeriodeDTO() {}

    public PeriodeDTO(int id, Date dateDebut, Date dateFin, String stagiaireCin, String tuteurCin, int stageId) {
        this.id = id;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.stagiaireCin = stagiaireCin;
        this.tuteurCin = tuteurCin;
        this.stageId = stageId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
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

    public String getStagiaireCin() {
        return stagiaireCin;
    }

    public void setStagiaireCin(String stagiaireCin) {
        this.stagiaireCin = stagiaireCin;
    }

    public String getTuteurCin() {
        return tuteurCin;
    }

    public void setTuteurCin(String tuteurCin) {
        this.tuteurCin = tuteurCin;
    }

    public int getStageId() {
        return stageId;
    }

    public void setStageId(int stageId) {
        this.stageId = stageId;
    }
}

