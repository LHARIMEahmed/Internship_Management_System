package com.example.services;
import com.example.models.Stage;
import com.example.repositories.StageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StageService {

    @Autowired
    private StageRepository stageRepository;

    public List<Stage> getAllStages() {
        return stageRepository.findAll();
    }

    public Optional<Stage> getStageById(int id) {
        return stageRepository.findById(id);
    }

    public Stage saveStage(Stage stage) {
        return stageRepository.save(stage);
    }

    public void deleteStage(int id) {
        stageRepository.deleteById(id);
    }
}

