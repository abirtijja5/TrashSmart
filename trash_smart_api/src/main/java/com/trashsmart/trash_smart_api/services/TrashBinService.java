package com.trashsmart.trash_smart_api.services;

import com.trashsmart.trash_smart_api.entities.TrashBin;
import java.util.List;
import java.util.Optional;

public interface TrashBinService {
    TrashBin create(TrashBin bin);
    List<TrashBin> getAll();
    Optional<TrashBin> getById(String id);
    TrashBin update(String id, TrashBin updated);
    void delete(String id);
}
