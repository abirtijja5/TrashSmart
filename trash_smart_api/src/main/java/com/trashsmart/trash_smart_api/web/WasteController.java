package com.trashsmart.trash_smart_api.web;

import com.trashsmart.trash_smart_api.entities.Waste;
import com.trashsmart.trash_smart_api.services.WasteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class WasteController {
    private final WasteService service;

    @GetMapping
    public List<Waste> getAll() { return service.getAll(); }

    @GetMapping("/weekly")
    public List<Map<String,Object>> weekly() { return service.getWeeklyData(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Waste create(@RequestBody Waste waste) { return service.create(waste); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) { service.delete(id); }
}
