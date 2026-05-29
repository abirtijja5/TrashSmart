package com.trashsmart.trash_smart_api.waste.services;

import com.trashsmart.trash_smart_api.waste.dtos.WasteDto;

import java.util.List;

public interface WasteService {
    WasteDto addWaste(WasteDto wasteDto);
    List<WasteDto> getAllWastes();
}

