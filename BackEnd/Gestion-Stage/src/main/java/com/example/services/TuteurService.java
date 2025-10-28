package com.example.services;


import com.example.models.Tuteur;
import com.example.repositories.TuteurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TuteurService {

    @Autowired
    private TuteurRepository tuteurRepository;

    public List<Tuteur> getAllTuteurs() {
        return tuteurRepository.findAll();
    }

    public Optional<Tuteur> getTuteurByCin(String cin) {
        return tuteurRepository.findById(cin);
    }

    public Tuteur saveTuteur(Tuteur tuteur) {
        return tuteurRepository.save(tuteur);
    }

    public void deleteTuteur(String cin) {
        tuteurRepository.deleteById(cin);
    }
}
