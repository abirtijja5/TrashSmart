package com.trashsmart.trash_smart_api.web;

import com.trashsmart.trash_smart_api.entities.TrashBin;
import com.trashsmart.trash_smart_api.services.TrashBinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bins")
@RequiredArgsConstructor
public class TrashBinController {
    private final TrashBinService service;

    @GetMapping
    public List<TrashBin> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return service.getById(id)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message","Bin not found")));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrashBin create(@RequestBody TrashBin bin) {
        if (bin.getLastUpdate() == null) bin.setLastUpdate(LocalDateTime.now());
        if (bin.getStatus() == null) bin.setStatus(bin.getFillLevel() >= 90 ? "critical" : bin.getFillLevel() >= 70 ? "warning" : "normal");
        bin.setActive(true);
        return service.create(bin);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody TrashBin updates) {
        try { return ResponseEntity.ok(service.update(id, updates)); }
        catch (RuntimeException e) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) { service.delete(id); }
}
