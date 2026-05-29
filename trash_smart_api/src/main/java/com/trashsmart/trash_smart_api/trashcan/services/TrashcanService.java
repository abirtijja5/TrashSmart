package com.trashsmart.trash_smart_api.trashcan.services;

        import com.trashsmart.trash_smart_api.trashcan.dtos.TrashcanDto;
        import org.springframework.stereotype.Service;
        import java.util.List;

@Service
public interface TrashcanService {
    TrashcanDto addTrashcan(TrashcanDto trashcanDto);
    List<TrashcanDto> getAllTrashcans();
    TrashcanDto updateTrashcan(Long id, TrashcanDto trashcanDto);

    void deleteTrashcan(Long id);

}


