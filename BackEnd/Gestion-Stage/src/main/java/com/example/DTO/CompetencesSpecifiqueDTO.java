package com.example.DTO;


public class CompetencesSpecifiqueDTO {

    private int id;
    private String competence;
    private int evaluation;
    private int periodeId;

    public CompetencesSpecifiqueDTO() {}

    public CompetencesSpecifiqueDTO(int id, String competence, int evaluation, int periodeId) {
        this.id = id;
        this.competence = competence;
        this.evaluation = evaluation;
        this.periodeId = periodeId;
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCompetence() {
		return competence;
	}

	public void setCompetence(String competence) {
		this.competence = competence;
	}

	public int getEvaluation() {
		return evaluation;
	}

	public void setEvaluation(int evaluation) {
		this.evaluation = evaluation;
	}

	public int getPeriodeId() {
		return periodeId;
	}

	public void setPeriodeId(int periodeId) {
		this.periodeId = periodeId;
	}

    
}
