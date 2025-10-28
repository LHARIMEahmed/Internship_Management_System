package com.example.models;


import jakarta.persistence.*;

@Entity
public class CompetencesSpecifique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String competence;

    private Integer evaluation;

    @ManyToOne
    @JoinColumn(name = "periode_id", nullable = false)
    private Periode periode;

    public CompetencesSpecifique() {}

    public CompetencesSpecifique(Integer id, String competence, Integer evaluation, Periode periode) {
        this.id = id;
        this.competence = competence;
        this.evaluation = evaluation;
        this.periode = periode;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCompetence() {
        return competence;
    }

    public void setCompetence(String competence) {
        this.competence = competence;
    }

    public Integer getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(Integer evaluation) {
        this.evaluation = evaluation;
    }

    public Periode getPeriode() {
        return periode;
    }

    public void setPeriode(Periode periode) {
        this.periode = periode;
    }
}
