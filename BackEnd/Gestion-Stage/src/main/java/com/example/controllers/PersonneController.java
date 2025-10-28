package com.example.controllers;

import com.example.models.Personne;

import com.example.services.PersonneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/personnes")
public class PersonneController {

    @Autowired
    private PersonneService personneService;

    @GetMapping
    public List<Personne> getAllPersonnes() {
        return personneService.getAllPersonnes();
    }

    @GetMapping("/{cin}")
    public Optional<Personne> getPersonne(@PathVariable String cin) {
        return personneService.getPersonneByCin(cin);
    }

    @PostMapping
    public Personne createPersonne(@RequestBody Personne personne) {
        return personneService.savePersonne(personne);
    }

    @DeleteMapping("/{cin}")
    public void deletePersonne(@PathVariable String cin) {
        personneService.deletePersonne(cin);
    }
}

