package com.example.DTO;

public class CompetenceEntrepriseDTO {

    private int id;
    private int idPeriode;
    private int fonctionnementEntreprise;
    private int demarcheProjet;
    private int politiqueEnvironnementale;
    private int rechercheInformation;
    private double noteGlobale;

    public CompetenceEntrepriseDTO() {}

    public CompetenceEntrepriseDTO(int id, int idPeriode, int fonctionnementEntreprise, int demarcheProjet,
                                   int politiqueEnvironnementale, int rechercheInformation, double noteGlobale) {
        this.id = id;
        this.idPeriode = idPeriode;
        this.fonctionnementEntreprise = fonctionnementEntreprise;
        this.demarcheProjet = demarcheProjet;
        this.politiqueEnvironnementale = politiqueEnvironnementale;
        this.rechercheInformation = rechercheInformation;
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

	public int getFonctionnementEntreprise() {
		return fonctionnementEntreprise;
	}

	public void setFonctionnementEntreprise(int fonctionnementEntreprise) {
		this.fonctionnementEntreprise = fonctionnementEntreprise;
	}

	public int getDemarcheProjet() {
		return demarcheProjet;
	}

	public void setDemarcheProjet(int demarcheProjet) {
		this.demarcheProjet = demarcheProjet;
	}

	public int getPolitiqueEnvironnementale() {
		return politiqueEnvironnementale;
	}

	public void setPolitiqueEnvironnementale(int politiqueEnvironnementale) {
		this.politiqueEnvironnementale = politiqueEnvironnementale;
	}

	public int getRechercheInformation() {
		return rechercheInformation;
	}

	public void setRechercheInformation(int rechercheInformation) {
		this.rechercheInformation = rechercheInformation;
	}

	public double getNoteGlobale() {
		return noteGlobale;
	}

	public void setNoteGlobale(double noteGlobale) {
		this.noteGlobale = noteGlobale;
	}

    
}

