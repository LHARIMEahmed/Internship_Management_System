package com.example.controllers;

import com.example.models.CompetenceScientifiqueTechnique;


import com.example.services.CompetenceScientifiqueTechniqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/competences-scientifiques")
public class CompetenceScientifiqueTechniqueController {

    @Autowired
    private CompetenceScientifiqueTechniqueService competenceScientifiqueTechniqueService;

    @GetMapping
    public List<CompetenceScientifiqueTechnique> getAllCompetences() {
        return competenceScientifiqueTechniqueService.getAllCompetences();
    }

    @GetMapping("/{id}")
    public Optional<CompetenceScientifiqueTechnique> getCompetence(@PathVariable int id) {
        return competenceScientifiqueTechniqueService.getCompetenceById(id);
    }

    @PostMapping
    public CompetenceScientifiqueTechnique createCompetence(@RequestBody CompetenceScientifiqueTechnique competence) {
        return competenceScientifiqueTechniqueService.saveCompetence(competence);
    }
    @PutMapping("/{id}")
    public CompetenceScientifiqueTechnique updateCompetence(@PathVariable int id, @RequestBody CompetenceScientifiqueTechnique competence) {
        // Vérifier si la compétence existe
        Optional<CompetenceScientifiqueTechnique> existingCompetence = competenceScientifiqueTechniqueService.getCompetenceById(id);
        if (!existingCompetence.isPresent()) {
            throw new RuntimeException("Compétence scientifique technique not found with id: " + id);
        }
        
        // S'assurer que l'ID est correctement défini
        competence.setId(id);
        
        // Enregistrer les modifications
        return competenceScientifiqueTechniqueService.saveCompetence(competence);
    }

    @DeleteMapping("/{id}")
    public void deleteCompetence(@PathVariable int id) {
        competenceScientifiqueTechniqueService.deleteCompetence(id);
    }
    @GetMapping("/by-periode/{periodeId}")
    public CompetenceScientifiqueTechnique getCompetenceByPeriode(@PathVariable int periodeId) {
        return competenceScientifiqueTechniqueService.getCompetenceByPeriodeId(periodeId);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateCompetenceScientifiqueTechnique(
        @RequestParam String cinStagiaire,
        @RequestParam String cinTuteur,
        @RequestParam Integer idPeriode,
        @RequestBody Map<String, Object> updateData) {

        // Get values safely
        Object conceptionObj = updateData.get("conceptionPreliminaire");
        Object noteGlobaleObj = updateData.get("noteGlobale");
        
        // Convert properly to required types
        Integer conceptionValue = (conceptionObj instanceof Number) ? 
                                 ((Number)conceptionObj).intValue() : null;
        
        Double noteGlobaleValue = (noteGlobaleObj instanceof Number) ? 
                                 ((Number)noteGlobaleObj).doubleValue() : null;

        competenceScientifiqueTechniqueService.updateCompetenceScientifiqueTechnique(
            cinStagiaire,
            cinTuteur,
            idPeriode,
            conceptionValue,
            noteGlobaleValue
        );

        return ResponseEntity.ok().body("Compétences scientifiques et techniques mises à jour avec succès");
    }
}

