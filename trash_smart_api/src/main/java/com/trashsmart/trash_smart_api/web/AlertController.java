package com.trashsmart.trash_smart_api.web;

import com.trashsmart.trash_smart_api.entities.Alert;
import com.trashsmart.trash_smart_api.repositories.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {
    private final AlertRepository repo;

    @GetMapping
    public List<Alert> getAll() { return repo.findAll(); }

    @GetMapping("/active")
    public List<Alert> getActive() { return repo.findByAcknowledgedAtIsNull(); }

    @GetMapping("/count")
    public long count() { return repo.countByAcknowledgedAtIsNull(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Alert create(@RequestBody Alert alert) {
        if (alert.getCreatedAt() == null) alert.setCreatedAt(LocalDateTime.now());
        return repo.save(alert);
    }

    @PatchMapping("/{id}/acknowledge")
    public Alert acknowledge(@PathVariable Long id) {
        Alert alert = repo.findById(id).orElseThrow();
        alert.setAcknowledgedAt(LocalDateTime.now());
        return repo.save(alert);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
