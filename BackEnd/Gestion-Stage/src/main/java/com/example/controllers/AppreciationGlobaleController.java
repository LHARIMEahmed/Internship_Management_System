package com.example.controllers;

import com.example.DTO.AppreciationGlobaleDTO;
import com.example.models.AppreciationGlobale;
import com.example.models.Periode;
import com.example.repositories.PeriodeRepository;
import com.example.services.AppreciationGlobaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/appreciations")
public class AppreciationGlobaleController {

    @Autowired
    private AppreciationGlobaleService appreciationGlobaleService;

    @Autowired
    private PeriodeRepository periodeRepository;

    @GetMapping
    public List<AppreciationGlobale> getAllAppreciations() {
        return appreciationGlobaleService.getAllAppreciations();
    }

    @GetMapping("/{id}")
    public Optional<AppreciationGlobale> getAppreciation(@PathVariable int id) {
        return appreciationGlobaleService.getAppreciationById(id);
    }

    @PostMapping
    public AppreciationGlobale createAppreciation(@RequestBody AppreciationGlobaleDTO appreciationDTO) {
        // Créer une nouvelle entité AppreciationGlobale
        AppreciationGlobale appreciation = new AppreciationGlobale();

        // Charger l'entité Periode à partir de l'ID
        Periode periode = periodeRepository.findById(appreciationDTO.getIdPeriode())
            .orElseThrow(() -> new RuntimeException("Periode not found with id: " + appreciationDTO.getIdPeriode()));
        appreciation.setPeriode(periode);

        // Mapper les autres champs
        appreciation.setImplication(appreciationDTO.getImplication());
        appreciation.setOuverture(appreciationDTO.getOuverture());
        appreciation.setQualiteProductions(appreciationDTO.getQualiteProductions());
        appreciation.setObservations(appreciationDTO.getObservations());

        // Enregistrer l'entité
        return appreciationGlobaleService.saveAppreciation(appreciation);
    }
    @PutMapping("/{id}")
    public AppreciationGlobale updateAppreciation(@PathVariable int id, @RequestBody AppreciationGlobaleDTO appreciationDTO) {
        // Vérifier si l'appréciation existe
        AppreciationGlobale existingAppreciation = appreciationGlobaleService.getAppreciationById(id)
                .orElseThrow(() -> new RuntimeException("Appreciation not found with id: " + id));
        
        // Charger l'entité Periode à partir de l'ID
        Periode periode = periodeRepository.findById(appreciationDTO.getIdPeriode())
                .orElseThrow(() -> new RuntimeException("Periode not found with id: " + appreciationDTO.getIdPeriode()));
        
        // Mettre à jour les champs
        existingAppreciation.setPeriode(periode);
        existingAppreciation.setImplication(appreciationDTO.getImplication());
        existingAppreciation.setOuverture(appreciationDTO.getOuverture());
        existingAppreciation.setQualiteProductions(appreciationDTO.getQualiteProductions());
        existingAppreciation.setObservations(appreciationDTO.getObservations());
        
        // Enregistrer les modifications
        return appreciationGlobaleService.saveAppreciation(existingAppreciation);
    }
    @DeleteMapping("/{id}")
    public void deleteAppreciation(@PathVariable int id) {
        appreciationGlobaleService.deleteAppreciation(id);
    }
    
    @GetMapping("/by-periode/{periodeId}")
    public AppreciationGlobale getAppreciationByPeriode(@PathVariable int periodeId) {
        return appreciationGlobaleService.getAppreciationByPeriodeId(periodeId);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateAppreciationGlobale(
            @RequestParam String cinStagiaire,
            @RequestParam String cinTuteur,
            @RequestParam Integer idPeriode,
            @RequestBody Map<String, Object> updateData) {
        
        appreciationGlobaleService.updateAppreciationGlobale(
                cinStagiaire,
                cinTuteur,
                idPeriode,
                (Integer) updateData.get("implication"),
                (Integer) updateData.get("ouverture"),
                (Integer) updateData.get("qualiteProductions"),
                (String) updateData.get("observations")
        );
        
        return ResponseEntity.ok().body("Appreciation globale mise à jour avec succès");
    }
    
}