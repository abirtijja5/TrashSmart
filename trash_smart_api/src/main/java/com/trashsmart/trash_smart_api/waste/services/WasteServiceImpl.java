package com.trashsmart.trash_smart_api.waste.services;

import com.trashsmart.trash_smart_api.trashcan.entities.Trashcan;
import com.trashsmart.trash_smart_api.trashcan.repositories.TrashcanRepository;
import com.trashsmart.trash_smart_api.waste.dtos.WasteDto;
import com.trashsmart.trash_smart_api.waste.entities.Waste;
import com.trashsmart.trash_smart_api.waste.mappers.WasteMapper;
import com.trashsmart.trash_smart_api.waste.repositories.WasteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WasteServiceImpl implements WasteService {

    private final WasteRepository wasteRepository;
    private final TrashcanRepository trashcanRepository;
    private final WasteMapper wasteMapper;

    @Override
    public WasteDto addWaste(WasteDto wasteDto) {
        Trashcan trashcan = null;
        if (wasteDto.getTrashcanId() != null) {
            trashcan = trashcanRepository.findById(wasteDto.getTrashcanId())
                    .orElseThrow(() -> new RuntimeException("Poubelle non trouvée"));
        }

        Waste waste = wasteMapper.toEntity(wasteDto, trashcan);
        Waste savedWaste = wasteRepository.save(waste);
        return wasteMapper.toDto(savedWaste);
    }

    @Override
    public List<WasteDto> getAllWastes() {
        return wasteRepository.findAll().stream()
                .map(wasteMapper::toDto)
                .collect(Collectors.toList());
    }

   /* @Override
    public Waste saveWaste(Waste waste, Long trashBinId) {
        TrashBin trashBin = trashBinRepository.findById(trashBinId)
                .orElseThrow(() -> new RuntimeException("Trash bin not found"));
        waste.setTrashBin(trashBin);
        waste.setDepositedAt(LocalDateTime.now());
        return wasteRepository.save(waste);
    }*/

    /*@Override
    public List<Waste> getAllWastes() {
        return wasteRepository.findAll();
    }*/

   /* @Override
    public List<Waste> getWastesByTrashBin(Long trashBinId) {
        return wasteRepository.findByTrashBinId(trashBinId);
    }*/
}

