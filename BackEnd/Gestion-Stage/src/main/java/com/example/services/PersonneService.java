package com.example.services;
import com.example.models.Personne;

import com.example.repositories.PersonneRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class PersonneService {

    @Autowired
    private PersonneRepository personneRepository;

    public List<Personne> getAllPersonnes() {
        return personneRepository.findAll();
    }

    public Optional<Personne> getPersonneByCin(String cin) {
        return personneRepository.findById(cin);
    }

    public Personne savePersonne(Personne personne) {
        return personneRepository.save(personne);
    }

    public void deletePersonne(String cin) {
        personneRepository.deleteById(cin);
    }
}

