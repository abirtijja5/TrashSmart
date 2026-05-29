package com.trashsmart.trash_smart_api.services;

import com.trashsmart.trash_smart_api.entities.TrashBin;
import com.trashsmart.trash_smart_api.entities.Waste;
import com.trashsmart.trash_smart_api.repositories.TrashBinRepository;
import com.trashsmart.trash_smart_api.repositories.WasteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TrashBinServiceImpl implements TrashBinService {
    private final TrashBinRepository repo;
    private final WasteRepository wasteRepo;

    @Override
    public TrashBin create(TrashBin bin) {
        return repo.save(bin);
    }

    @Override
    public List<TrashBin> getAll() {
        return repo.findAll();
    }

    @Override
    public Optional<TrashBin> getById(String id) {
        return repo.findById(id);
    }

    @Override
    public TrashBin update(String id, TrashBin updated) {
        TrashBin bin = repo.findById(id).orElseThrow(() -> new RuntimeException("Bin not found: " + id));
        if (updated.getLocation() != null) bin.setLocation(updated.getLocation());
        if (updated.getType() != null) bin.setType(updated.getType());
        if (updated.getFillLevel() > 0 || updated.getFillLevel() == 0) bin.setFillLevel(updated.getFillLevel());
        bin.setLastUpdate(java.time.LocalDateTime.now());
        recomputeStatus(bin);
        return repo.save(bin);
    }

    @Override
    public void delete(String id) {
        TrashBin bin = repo.findById(id).orElseThrow(() -> new RuntimeException("Bin not found: " + id));
        repo.delete(bin);
    }

    private void recomputeStatus(TrashBin bin) {
        if (bin.getFillLevel() >= 90) bin.setStatus("critical");
        else if (bin.getFillLevel() >= 70) bin.setStatus("warning");
        else bin.setStatus("normal");
    }
}
