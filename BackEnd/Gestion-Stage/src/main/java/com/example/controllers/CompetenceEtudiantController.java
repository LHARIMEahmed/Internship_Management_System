package com.example.controllers;

import com.example.models.CompetenceEtudiant;
import com.example.services.CompetenceEtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/competences-etudiant")
public class CompetenceEtudiantController {

    @Autowired
    private CompetenceEtudiantService competenceEtudiantService;

    @GetMapping
    public List<CompetenceEtudiant> getAllCompetences() {
        return competenceEtudiantService.getAllCompetences();
    }

    @GetMapping("/{id}")
    public Optional<CompetenceEtudiant> getCompetence(@PathVariable int id) {
        return competenceEtudiantService.getCompetenceById(id);
    }

    @PostMapping
    public CompetenceEtudiant createCompetence(@RequestBody CompetenceEtudiant competenceEtudiant) {
        return competenceEtudiantService.saveCompetence(competenceEtudiant);
    }
    @PutMapping("/{id}")
    public CompetenceEtudiant updateCompetence(@PathVariable int id, @RequestBody CompetenceEtudiant competenceEtudiant) {
        // Vérifier si la compétence existe
        Optional<CompetenceEtudiant> existingCompetence = competenceEtudiantService.getCompetenceById(id);
        if (!existingCompetence.isPresent()) {
            throw new RuntimeException("Compétence étudiant not found with id: " + id);
        }
        
        // S'assurer que l'ID est correctement défini
        competenceEtudiant.setId(id);
        
        // Enregistrer les modifications
        return competenceEtudiantService.saveCompetence(competenceEtudiant);
    }

    @DeleteMapping("/{id}")
    public void deleteCompetence(@PathVariable int id) {
        competenceEtudiantService.deleteCompetence(id);
    }
    @GetMapping("/by-periode/{periodeId}")
    public CompetenceEtudiant getCompetenceByPeriode(@PathVariable int periodeId) {
        return competenceEtudiantService.getCompetenceByPeriodeId(periodeId);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateCompetenceEtudiant(
        @RequestParam String cinStagiaire,
        @RequestParam String cinTuteur,
        @RequestParam Integer idPeriode,
        @RequestBody Map<String, Object> updateData) {

        // Get values and convert properly
        Object analyseSyntheseObj = updateData.get("analyseSynthese");
        Object methodesAxesTravailObj = updateData.get("methodesAxesTravail");
        Object faireAdhererActeursObj = updateData.get("faireAdhererActeurs");
        Object contexteInternationalObj = updateData.get("contexteInternational");
        Object autoEvaluationObj = updateData.get("autoEvaluation");
        Object identifierProblemesObj = updateData.get("identifierProblemes");
        Object noteGlobaleObj = updateData.get("noteGlobale");
        
        // Safe conversions
        Integer analyseSyntheseValue = (analyseSyntheseObj instanceof Number) ? 
                                      ((Number)analyseSyntheseObj).intValue() : null;
        
        Integer methodesAxesTravailValue = (methodesAxesTravailObj instanceof Number) ? 
                                          ((Number)methodesAxesTravailObj).intValue() : null;
        
        Integer faireAdhererActeursValue = (faireAdhererActeursObj instanceof Number) ? 
                                          ((Number)faireAdhererActeursObj).intValue() : null;
        
        Integer contexteInternationalValue = (contexteInternationalObj instanceof Number) ? 
                                            ((Number)contexteInternationalObj).intValue() : null;
        
        Integer autoEvaluationValue = (autoEvaluationObj instanceof Number) ? 
                                     ((Number)autoEvaluationObj).intValue() : null;
        
        Integer identifierProblemesValue = (identifierProblemesObj instanceof Number) ? 
                                          ((Number)identifierProblemesObj).intValue() : null;
        
        Double noteGlobaleValue = (noteGlobaleObj instanceof Number) ? 
                                 ((Number)noteGlobaleObj).doubleValue() : null;

        competenceEtudiantService.updateCompetenceEtudiant(
            cinStagiaire,
            cinTuteur,
            idPeriode,
            analyseSyntheseValue,
            methodesAxesTravailValue,
            faireAdhererActeursValue,
            contexteInternationalValue,
            autoEvaluationValue,
            identifierProblemesValue,
            noteGlobaleValue
        );

        return ResponseEntity.ok().body("Compétences étudiant mises à jour avec succès");
    }

}
