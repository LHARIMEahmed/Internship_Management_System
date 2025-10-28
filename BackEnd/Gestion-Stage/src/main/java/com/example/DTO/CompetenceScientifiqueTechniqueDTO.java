package com.example.DTO;
public class CompetenceScientifiqueTechniqueDTO {

    private int id;
    private int idPeriode;
    private int conceptionPreliminaire;
    private double noteGlobale;

    public CompetenceScientifiqueTechniqueDTO() {}

    public CompetenceScientifiqueTechniqueDTO(int id, int idPeriode, int conceptionPreliminaire, double noteGlobale) {
        this.id = id;
        this.idPeriode = idPeriode;
        this.conceptionPreliminaire = conceptionPreliminaire;
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

	public int getConceptionPreliminaire() {
		return conceptionPreliminaire;
	}

	public void setConceptionPreliminaire(int conceptionPreliminaire) {
		this.conceptionPreliminaire = conceptionPreliminaire;
	}

	public double getNoteGlobale() {
		return noteGlobale;
	}

	public void setNoteGlobale(double noteGlobale) {
		this.noteGlobale = noteGlobale;
	}

    
}

