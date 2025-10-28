package com.example.controllers;

import com.example.models.CompetencesSpecifique;

import com.example.services.CompetencesSpecifiqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/competences-specifiques")
public class CompetencesSpecifiqueController {

    @Autowired
    private CompetencesSpecifiqueService competencesSpecifiqueService;

    @GetMapping
    public List<CompetencesSpecifique> getAllCompetences() {
        return competencesSpecifiqueService.getAllCompetences();
    }

    @GetMapping("/{id}")
    public Optional<CompetencesSpecifique> getCompetence(@PathVariable int id) {
        return competencesSpecifiqueService.getCompetenceById(id);
    }

    @PostMapping
    public CompetencesSpecifique createCompetence(@RequestBody CompetencesSpecifique competence) {
        return competencesSpecifiqueService.saveCompetence(competence);
    }
    @PutMapping("/{id}")
    public CompetencesSpecifique updateCompetence(@PathVariable int id, @RequestBody CompetencesSpecifique competence) {
        // Vérifier si la compétence existe
        Optional<CompetencesSpecifique> existingCompetence = competencesSpecifiqueService.getCompetenceById(id);
        if (!existingCompetence.isPresent()) {
            throw new RuntimeException("Compétence spécifique not found with id: " + id);
        }
        
        // S'assurer que l'ID est correctement défini
        competence.setId(id);
        
        // Enregistrer les modifications
        return competencesSpecifiqueService.saveCompetence(competence);
    }
    @DeleteMapping("/{id}")
    public void deleteCompetence(@PathVariable int id) {
        competencesSpecifiqueService.deleteCompetence(id);
    }
    @GetMapping("/by-periode/{periodeId}")
    public List<CompetencesSpecifique> getCompetencesByPeriode(@PathVariable int periodeId) {
        return competencesSpecifiqueService.getCompetencesByPeriodeId(periodeId);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateCompetenceSpecifique(
            @RequestParam String cinStagiaire,
            @RequestParam String cinTuteur,
            @RequestParam Integer idPeriode,
            @RequestParam String nomCompetence,
            @RequestBody Map<String, Object> updateData) {
        
    	competencesSpecifiqueService.updateCompetenceSpecifique(
                cinStagiaire,
                cinTuteur,
                idPeriode,
                nomCompetence,
                (Integer) updateData.get("evaluation")
        );
        
        return ResponseEntity.ok().body("Compétence spécifique mise à jour avec succès");
    }
}

