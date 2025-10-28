package com.example.controllers;

import com.example.models.Periode;
import com.example.services.PeriodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/periodes")
public class PeriodeController {

    @Autowired
    private PeriodeService periodeService;

    @GetMapping
    public List<Periode> getAllPeriodes() {
        return periodeService.getAllPeriodes();
    }

    @GetMapping("/{id}")
    public Optional<Periode> getPeriode(@PathVariable int id) {
        return periodeService.getPeriodeById(id);
    }

    @PostMapping
    public Periode createPeriode(@RequestBody Periode periode) {
        return periodeService.savePeriode(periode);
    }
    @PutMapping("/{id}")
    public Periode updatePeriode(@PathVariable int id, @RequestBody Periode periode) {
        // Vérifier si la période existe
        Optional<Periode> existingPeriode = periodeService.getPeriodeById(id);
        if (!existingPeriode.isPresent()) {
            throw new RuntimeException("Période not found with id: " + id);
        }
        
        // S'assurer que l'ID est correctement défini
        periode.setId(id);
        
        // Enregistrer les modifications
        return periodeService.savePeriode(periode);
    }

    @DeleteMapping("/{id}")
    public void deletePeriode(@PathVariable int id) {
        periodeService.deletePeriode(id);
    }
}
