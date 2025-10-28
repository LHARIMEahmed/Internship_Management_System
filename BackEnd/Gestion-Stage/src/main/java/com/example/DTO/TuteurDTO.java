package com.example.DTO;


public class TuteurDTO {

    private String cin;
    private String entreprise;

    public TuteurDTO() {}

    public TuteurDTO(String cin, String entreprise) {
        this.cin = cin;
        this.entreprise = entreprise;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }
}
