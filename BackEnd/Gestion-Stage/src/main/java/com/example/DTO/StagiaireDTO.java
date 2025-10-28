package com.example.DTO;

public class StagiaireDTO {

    private String cin;
    private String institution;

    public StagiaireDTO() {}

    public StagiaireDTO(String cin, String institution) {
        this.cin = cin;
        this.institution = institution;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }
}

