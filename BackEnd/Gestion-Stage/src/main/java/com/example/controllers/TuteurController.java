package com.example.controllers;

import com.example.models.Tuteur;

import com.example.services.TuteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tuteurs")
public class TuteurController {

    @Autowired
    private TuteurService tuteurService;

    @GetMapping
    public List<Tuteur> getAllTuteurs() {
        return tuteurService.getAllTuteurs();
    }

    @GetMapping("/{cin}")
    public Optional<Tuteur> getTuteur(@PathVariable String cin) {
        return tuteurService.getTuteurByCin(cin);
    }

    @PostMapping
    public Tuteur createTuteur(@RequestBody Tuteur tuteur) {
        return tuteurService.saveTuteur(tuteur);
    }

    @DeleteMapping("/{cin}")
    public void deleteTuteur(@PathVariable String cin) {
        tuteurService.deleteTuteur(cin);
    }
}
