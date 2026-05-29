package com.trashsmart.trash_smart_api.services;

import com.trashsmart.trash_smart_api.entities.Alert;
import com.trashsmart.trash_smart_api.entities.TrashBin;
import com.trashsmart.trash_smart_api.entities.Waste;
import com.trashsmart.trash_smart_api.repositories.AlertRepository;
import com.trashsmart.trash_smart_api.repositories.TrashBinRepository;
import com.trashsmart.trash_smart_api.repositories.WasteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class WasteServiceImpl implements WasteService {
    private final WasteRepository repo;
    private final TrashBinRepository binRepo;
    private final AlertRepository alertRepo;

    @Override
    public Waste create(Waste waste) {
        if (waste.getCollectedAt() == null) waste.setCollectedAt(LocalDateTime.now());
        Waste saved = repo.save(waste);
        // Update bin fill level after collection
        binRepo.findById(waste.getBinId()).ifPresent(bin -> {
            bin.setFillLevel(Math.max(0, bin.getFillLevel() - 20));
            if (bin.getFillLevel() < 70) bin.setStatus("normal");
            else if (bin.getFillLevel() < 90) bin.setStatus("warning");
            bin.setLastUpdate(LocalDateTime.now());
            binRepo.save(bin);
        });
        return saved;
    }

    @Override
    public List<Waste> getAll() {
        return repo.findAll();
    }

    @Override
    public void delete(String id) {
        repo.deleteById(id);
    }

    @Override
    public List<Map<String, Object>> getWeeklyData() {
        List<Map<String,Object>> result = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime day = LocalDateTime.now().minusDays(i).withHour(0).withMinute(0);
            LocalDateTime next = day.plusDays(1);
            List<Waste> dayWastes = repo.findByCollectedAtBetween(day, next);
            Map<String,Object> data = new LinkedHashMap<>();
            data.put("day", day.format(DateTimeFormatter.ofPattern("EEE", Locale.FRENCH)));
            data.put("plastique", dayWastes.stream().filter(w -> "plastique".equals(w.getWasteType())).mapToDouble(Waste::getWeightKg).sum());
            data.put("verre",     dayWastes.stream().filter(w -> "verre".equals(w.getWasteType())).mapToDouble(Waste::getWeightKg).sum());
            data.put("papier",    dayWastes.stream().filter(w -> "papier".equals(w.getWasteType())).mapToDouble(Waste::getWeightKg).sum());
            data.put("metal",     dayWastes.stream().filter(w -> "metal".equals(w.getWasteType())).mapToDouble(Waste::getWeightKg).sum());
            data.put("organique", dayWastes.stream().filter(w -> "organique".equals(w.getWasteType())).mapToDouble(Waste::getWeightKg).sum());
            result.add(data);
        }
        return result;
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        List<Waste> all = repo.findAll();
        double total = all.stream().mapToDouble(Waste::getWeightKg).sum();
        long bins = binRepo.count();
        long critical = binRepo.findAll().stream().filter(b -> "critical".equals(b.getStatus())).count();
        long alerts = alertRepo.countByAcknowledgedAtIsNull();

        List<Object[]> byType = repo.sumByType();
        List<Map<String,Object>> wasteTypes = new ArrayList<>();
        String[] colors = {"#1D9E75","#378ADD","#EF9F27","#D4537E","#639922","#888780"};
        int ci = 0;
        for (Object[] row : byType) {
            double kg = row[1] == null ? 0 : ((Number) row[1]).doubleValue();
            Map<String,Object> t = new LinkedHashMap<>();
            t.put("type", row[0]);
            t.put("kg", Math.round(kg));
            t.put("percent", total > 0 ? Math.round((kg/total)*1000.0)/10.0 : 0);
            t.put("color", colors[ci++ % colors.length]);
            wasteTypes.add(t);
        }

        Map<String,Object> stats = new LinkedHashMap<>();
        stats.put("totalCollected", Math.round(total));
        stats.put("co2Saved", Math.round(total * 0.8));
        stats.put("activeBins", bins);
        stats.put("criticalBins", critical);
        stats.put("pendingAlerts", alerts);
        stats.put("collectionsThisMonth", all.size());
        stats.put("wasteTypes", wasteTypes);
        return stats;
    }

    @Override
    public List<Map<String, Object>> getEfficiencyTrend(int days) {
        List<Map<String,Object>> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM");
        for (int i = days - 1; i >= 0; i--) {
            LocalDateTime day = LocalDateTime.now().minusDays(i).withHour(0).withMinute(0);
            LocalDateTime next = day.plusDays(1);
            List<Waste> dayWastes = repo.findByCollectedAtBetween(day, next);
            double kg = dayWastes.stream().mapToDouble(Waste::getWeightKg).sum();
            Map<String,Object> d = new LinkedHashMap<>();
            d.put("date", day.format(fmt));
            d.put("efficiency", 70 + Math.round(kg / 10.0));
            result.add(d);
        }
        return result;
    }
}
