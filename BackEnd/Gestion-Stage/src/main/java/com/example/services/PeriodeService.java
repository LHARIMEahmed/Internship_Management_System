package com.example.services;

import com.example.models.Periode;
import com.example.repositories.PeriodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PeriodeService {

    @Autowired
    private PeriodeRepository periodeRepository;

    public List<Periode> getAllPeriodes() {
        return periodeRepository.findAll();
    }

    public Optional<Periode> getPeriodeById(int id) {
        return periodeRepository.findById(id);
    }

    public Periode savePeriode(Periode periode) {
        return periodeRepository.save(periode);
    }

    public void deletePeriode(int id) {
        periodeRepository.deleteById(id);
    }
}
