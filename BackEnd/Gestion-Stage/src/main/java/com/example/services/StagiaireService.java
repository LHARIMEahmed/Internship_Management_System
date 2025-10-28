package com.example.services;

import com.example.models.Stagiaire;
import com.example.repositories.StagiaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StagiaireService {

    @Autowired
    private StagiaireRepository stagiaireRepository;

    public List<Stagiaire> getAllStagiaires() {
        return stagiaireRepository.findAll();
    }

    public Optional<Stagiaire> getStagiaireByCin(String cin) {
        return stagiaireRepository.findById(cin);
    }

    public Stagiaire saveStagiaire(Stagiaire stagiaire) {
        return stagiaireRepository.save(stagiaire);
    }

    public void deleteStagiaire(String cin) {
        stagiaireRepository.deleteById(cin);
    }
}

