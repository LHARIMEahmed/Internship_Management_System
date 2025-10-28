package com.example.controllers;

import com.example.models.Stage;
import com.example.services.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/stages")
public class StageController {

    @Autowired
    private StageService stageService;

    @GetMapping
    public List<Stage> getAllStages() {
        return stageService.getAllStages();
    }

    @GetMapping("/{id}")
    public Optional<Stage> getStage(@PathVariable int id) {
        return stageService.getStageById(id);
    }

    @PostMapping
    public Stage createStage(@RequestBody Stage stage) {
        return stageService.saveStage(stage);
    }
    @PutMapping("/{id}")
    public Stage updateStage(@PathVariable int id, @RequestBody Stage stage) {
        // Vérifier si le stage existe
        Optional<Stage> existingStage = stageService.getStageById(id);
        if (!existingStage.isPresent()) {
            throw new RuntimeException("Stage not found with id: " + id);
        }
        
        // S'assurer que l'ID est correctement défini
        stage.setId(id);
        
        // Enregistrer les modifications
        return stageService.saveStage(stage);
    }

    @DeleteMapping("/{id}")
    public void deleteStage(@PathVariable int id) {
        stageService.deleteStage(id);
    }
}
