package com.example.controllers;


import com.example.models.Stagiaire;

import com.example.services.StagiaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/stagiaires")
public class StagiaireController {

    @Autowired
    private StagiaireService stagiaireService;

    @GetMapping
    public List<Stagiaire> getAllStagiaires() {
        return stagiaireService.getAllStagiaires();
    }

    @GetMapping("/{cin}")
    public Optional<Stagiaire> getStagiaire(@PathVariable String cin) {
        return stagiaireService.getStagiaireByCin(cin);
    }

    @PostMapping
    public Stagiaire createStagiaire(@RequestBody Stagiaire stagiaire) {
        return stagiaireService.saveStagiaire(stagiaire);
    }

    @DeleteMapping("/{cin}")
    public void deleteStagiaire(@PathVariable String cin) {
        stagiaireService.deleteStagiaire(cin);
    }
}
