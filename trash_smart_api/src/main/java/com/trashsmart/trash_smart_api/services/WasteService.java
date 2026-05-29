package com.trashsmart.trash_smart_api.services;

import com.trashsmart.trash_smart_api.entities.Waste;
import java.util.List;
import java.util.Map;

public interface WasteService {
    Waste create(Waste waste);
    List<Waste> getAll();
    void delete(String id);
    List<Map<String,Object>> getWeeklyData();
    Map<String,Object> getDashboardStats();
    List<Map<String,Object>> getEfficiencyTrend(int days);
}
