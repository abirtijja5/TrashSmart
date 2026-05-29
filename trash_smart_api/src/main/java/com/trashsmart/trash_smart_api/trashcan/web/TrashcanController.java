package com.trashsmart.trash_smart_api.trashcan.web;

import com.trashsmart.trash_smart_api.trashcan.dtos.TrashcanDto;
import com.trashsmart.trash_smart_api.trashcan.services.TrashcanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trashcans")
@RequiredArgsConstructor
public class TrashcanController {

    private final TrashcanService trashcanService;

    @PostMapping
    public TrashcanDto createTrashcan(@RequestBody TrashcanDto trashcanDto) {
        return trashcanService.addTrashcan(trashcanDto);
    }

    @GetMapping
    public List<TrashcanDto> getAll() {
        return trashcanService.getAllTrashcans();
    }

    @PutMapping("/{id}")
    public TrashcanDto updateTrashcan(@PathVariable Long id, @RequestBody TrashcanDto trashcanDto) {
        return trashcanService.updateTrashcan(id, trashcanDto);
    }

    @DeleteMapping("/{id}")
    public void deleteTrashcan(@PathVariable Long id) {
        trashcanService.deleteTrashcan(id);
    }

}
