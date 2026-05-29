package com.trashsmart.trash_smart_api.trashcan.services;

import com.trashsmart.trash_smart_api.trashcan.dtos.TrashcanDto;
import com.trashsmart.trash_smart_api.trashcan.entities.Trashcan;
import com.trashsmart.trash_smart_api.trashcan.mappers.TrashcanMapper;
import com.trashsmart.trash_smart_api.trashcan.repositories.TrashcanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrashcanServiceImpl implements TrashcanService {

    private final TrashcanRepository trashcanRepository;
    private final TrashcanMapper trashcanMapper;

    @Override
    public TrashcanDto addTrashcan(TrashcanDto trashcanDto) {
        Trashcan trashcan = trashcanMapper.toEntity(trashcanDto);
        Trashcan savedTrashcan = trashcanRepository.save(trashcan);
        return trashcanMapper.toDto(savedTrashcan);
    }

    @Override
    public List<TrashcanDto> getAllTrashcans() {
        return trashcanRepository.findAll().stream()
                .map(trashcanMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public TrashcanDto updateTrashcan(Long id, TrashcanDto trashcanDto) {
        Trashcan existingTrashcan = trashcanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trashcan not found with id: " + id));

        existingTrashcan.setReference(trashcanDto.getReference());
        existingTrashcan.setLatitude(trashcanDto.getLatitude());
        existingTrashcan.setLongitude(trashcanDto.getLongitude());
        existingTrashcan.setFull(trashcanDto.isFull());
        existingTrashcan.setBlocked(trashcanDto.isBlocked());

        Trashcan updatedTrashcan = trashcanRepository.save(existingTrashcan);
        return trashcanMapper.toDto(updatedTrashcan);
    }
    @Override
    public void deleteTrashcan(Long id) {
        if (!trashcanRepository.existsById(id)) {
            throw new RuntimeException("Trashcan not found with id: " + id);
        }
        trashcanRepository.deleteById(id);
    }

}

