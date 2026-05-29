package com.trashsmart.trash_smart_api.initialization;

import com.trashsmart.trash_smart_api.entities.Alert;
import com.trashsmart.trash_smart_api.entities.TrashBin;
import com.trashsmart.trash_smart_api.entities.Waste;
import com.trashsmart.trash_smart_api.repositories.AlertRepository;
import com.trashsmart.trash_smart_api.repositories.TrashBinRepository;
import com.trashsmart.trash_smart_api.repositories.WasteRepository;
import com.trashsmart.trash_smart_api.security.entities.AppRole;
import com.trashsmart.trash_smart_api.security.entities.AppUser;
import com.trashsmart.trash_smart_api.security.services.AccountAuthService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataInitializer {
    private final AccountAuthService authService;
    private final TrashBinRepository binRepo;
    private final WasteRepository wasteRepo;
    private final AlertRepository alertRepo;

    @PostConstruct
    public void init() {
        // Roles
        if (authService.appUsersList().isEmpty()) {
            authService.addRole(new AppRole(null, "ROLE_ADMIN"));
            authService.addRole(new AppRole(null, "ROLE_USER"));

            AppUser admin = new AppUser();
            admin.setUsername("admin");
            admin.setEmail("admin@trashsmart.fr");
            admin.setPassword("Admin1234!");
            admin.setEnabled(true);
            AppUser saved = authService.addUser(admin);
            authService.addRoleToUser("admin", "ROLE_ADMIN");
        }

        // Bins
        if (binRepo.count() == 0) {
            List<TrashBin> bins = List.of(
                bin("B-001","Place de la Mairie","plastique",85,"warning"),
                bin("B-002","Rue du Commerce","verre",42,"normal"),
                bin("B-003","Parc Montrouge","papier",96,"critical"),
                bin("B-004","Gare Centrale","metal",25,"normal"),
                bin("B-005","Avenue des Fleurs","organique",71,"warning"),
                bin("B-006","Centre Commercial","plastique",55,"normal"),
                bin("B-007","École Jules Ferry","papier",93,"critical"),
                bin("B-008","Parking République","verre",18,"normal")
            );
            binRepo.saveAll(bins);
        }

        // Alerts
        if (alertRepo.count() == 0) {
            List<Alert> alerts = List.of(
                alert("B-003","Parc Montrouge","Poubelle pleine — collecte urgente","critical"),
                alert("B-007","École Jules Ferry","Niveau critique atteint (93%)","critical"),
                alert("B-001","Place de la Mairie","Taux de remplissage élevé (85%)","warning"),
                alert("B-005","Avenue des Fleurs","Capteur : odeur détectée","warning")
            );
            alertRepo.saveAll(alerts);
        }

        // Collections (30 jours)
        if (wasteRepo.count() == 0) {
            Random rnd = new Random(42);
            String[] types = {"plastique","verre","papier","metal","organique"};
            String[] binIds = {"B-001","B-002","B-003","B-004","B-005","B-006","B-007","B-008"};
            for (int d = 29; d >= 0; d--) {
                for (String type : types) {
                    Waste w = new Waste();
                    w.setBinId(binIds[rnd.nextInt(binIds.length)]);
                    w.setWasteType(type);
                    w.setWeightKg(Math.round((100 + rnd.nextDouble() * 150) * 10.0) / 10.0);
                    w.setCollectedBy("Équipe A");
                    w.setCollectedAt(LocalDateTime.now().minusDays(d).withHour(10));
                    wasteRepo.save(w);
                }
            }
        }
    }

    private TrashBin bin(String id, String loc, String type, int fill, String status) {
        TrashBin b = new TrashBin();
        b.setId(id); b.setLocation(loc); b.setType(type);
        b.setFillLevel(fill); b.setStatus(status);
        b.setActive(true); b.setLastUpdate(LocalDateTime.now());
        return b;
    }

    private Alert alert(String binId, String loc, String msg, String sev) {
        Alert a = new Alert();
        a.setBinId(binId); a.setLocation(loc); a.setMessage(msg);
        a.setSeverity(sev); a.setCreatedAt(LocalDateTime.now());
        return a;
    }
}
