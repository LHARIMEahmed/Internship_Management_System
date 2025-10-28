package com.example.controllers;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import com.example.models.CompetenceEntreprise;
import com.example.services.CompetenceEntrepriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/competences-entreprise")
public class CompetenceEntrepriseController {

    @Autowired
    private CompetenceEntrepriseService competenceEntrepriseService;

    @GetMapping
    public List<CompetenceEntreprise> getAllCompetences() {
        return competenceEntrepriseService.getAllCompetences();
    }

    @GetMapping("/{id}")
    public Optional<CompetenceEntreprise> getCompetence(@PathVariable int id) {
        return competenceEntrepriseService.getCompetenceById(id);
    }

    @PostMapping
    public CompetenceEntreprise createCompetence(@RequestBody CompetenceEntreprise competenceEntreprise) {
        return competenceEntrepriseService.saveCompetence(competenceEntreprise);
    }

    @DeleteMapping("/{id}")
    public void deleteCompetence(@PathVariable int id) {
        competenceEntrepriseService.deleteCompetence(id);
    }
    @PutMapping("/{id}")
    public CompetenceEntreprise updateCompetence(@PathVariable int id, @RequestBody CompetenceEntreprise competenceEntreprise) {
        // Vérifier si la compétence existe
        Optional<CompetenceEntreprise> existingCompetence = competenceEntrepriseService.getCompetenceById(id);
        if (!existingCompetence.isPresent()) {
            throw new RuntimeException("Compétence not found with id: " + id);
        }
        
        // S'assurer que l'ID est correctement défini
        competenceEntreprise.setId(id);
        
        // Enregistrer les modifications
        return competenceEntrepriseService.saveCompetence(competenceEntreprise);
    }
    @GetMapping("/by-periode/{periodeId}")
    public CompetenceEntreprise getCompetenceByPeriode(@PathVariable int periodeId) {
        return competenceEntrepriseService.getCompetenceByPeriodeId(periodeId);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateCompetenceEntreprise(
        @RequestParam String cinStagiaire,
        @RequestParam String cinTuteur,
        @RequestParam Integer idPeriode,
        @RequestBody Map<String, Object> updateData) {

        // Get values and convert properly
        Object fonctionnementObj = updateData.get("fonctionnementEntreprise");
        Object demarcheObj = updateData.get("demarcheProjet");
        Object politiqueObj = updateData.get("politiqueEnvironnementale");
        Object rechercheObj = updateData.get("rechercheInformation");
        Object noteGlobaleObj = updateData.get("noteGlobale");
        
        // Safe conversions
        Integer fonctionnementValue = (fonctionnementObj instanceof Number) ? 
                                     ((Number)fonctionnementObj).intValue() : null;
        
        Integer demarcheValue = (demarcheObj instanceof Number) ? 
                               ((Number)demarcheObj).intValue() : null;
        
        Integer politiqueValue = (politiqueObj instanceof Number) ? 
                                ((Number)politiqueObj).intValue() : null;
        
        Integer rechercheValue = (rechercheObj instanceof Number) ? 
                                ((Number)rechercheObj).intValue() : null;
        
        Double noteGlobaleValue = (noteGlobaleObj instanceof Number) ? 
                                 ((Number)noteGlobaleObj).doubleValue() : null;

        competenceEntrepriseService.updateCompetenceEntreprise(
            cinStagiaire,
            cinTuteur,
            idPeriode,
            fonctionnementValue,
            demarcheValue,
            politiqueValue,
            rechercheValue,
            noteGlobaleValue
        );

        return ResponseEntity.ok().body("Compétences entreprise mises à jour avec succès");
    }
}

