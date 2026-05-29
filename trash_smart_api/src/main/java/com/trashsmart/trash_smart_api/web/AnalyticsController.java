package com.trashsmart.trash_smart_api.web;

import com.trashsmart.trash_smart_api.services.WasteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final WasteService wasteService;

    @GetMapping("/dashboard")
    public Map<String,Object> dashboard() { return wasteService.getDashboardStats(); }

    @GetMapping("/efficiency")
    public List<Map<String,Object>> efficiency(@RequestParam(defaultValue = "30") int days) {
        return wasteService.getEfficiencyTrend(days);
    }
}
