import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './users/entities/user.entity';
import { Bin, WasteType, BinStatus } from './bins/entities/bin.entity';
import { Collection } from './collections/entities/collection.entity';
import { Alert, AlertSeverity } from './alerts/entities/alert.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'trashsmart.db',
  entities: [User, Bin, Collection, Alert],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Base de données connectée.');

  // Admin par défaut
  const userRepo = AppDataSource.getRepository(User);
  const exists = await userRepo.findOne({ where: { email: 'admin@trashsmart.fr' } });
  if (!exists) {
    const admin = userRepo.create({
      email:    'admin@trashsmart.fr',
      password: await bcrypt.hash('Admin1234!', 12),
      name:     'Admin Principal',
      role:     UserRole.ADMIN,
    });
    await userRepo.save(admin);
    console.log('✔ Admin créé  →  admin@trashsmart.fr / Admin1234!');
  } else {
    console.log('ℹ Admin déjà existant, ignoré.');
  }

  // Poubelles de démonstration
  const binRepo = AppDataSource.getRepository(Bin);
  const bins = [
    { id: 'B-001', location: 'Place de la Mairie',  type: WasteType.PLASTIQUE, fillLevel: 85, status: BinStatus.WARNING  },
    { id: 'B-002', location: 'Rue du Commerce',     type: WasteType.VERRE,     fillLevel: 42, status: BinStatus.NORMAL   },
    { id: 'B-003', location: 'Parc Montrouge',      type: WasteType.PAPIER,    fillLevel: 96, status: BinStatus.CRITICAL },
    { id: 'B-004', location: 'Gare Centrale',       type: WasteType.METAL,     fillLevel: 25, status: BinStatus.NORMAL   },
    { id: 'B-005', location: 'Avenue des Fleurs',   type: WasteType.ORGANIQUE, fillLevel: 71, status: BinStatus.WARNING  },
    { id: 'B-006', location: 'Centre Commercial',   type: WasteType.PLASTIQUE, fillLevel: 55, status: BinStatus.NORMAL   },
    { id: 'B-007', location: 'École Jules Ferry',   type: WasteType.PAPIER,    fillLevel: 93, status: BinStatus.CRITICAL },
    { id: 'B-008', location: 'Parking République',  type: WasteType.VERRE,     fillLevel: 18, status: BinStatus.NORMAL   },
  ];
  for (const b of bins) {
    const exists = await binRepo.findOne({ where: { id: b.id } });
    if (!exists) await binRepo.save(binRepo.create({ ...b, lastUpdate: new Date() }));
  }
  console.log(`✔ ${bins.length} poubelles insérées.`);

  // Alertes de démonstration
  const alertRepo = AppDataSource.getRepository(Alert);
  const alertCount = await alertRepo.count();
  if (alertCount === 0) {
    const alerts = [
      { binId: 'B-003', message: 'Poubelle pleine — collecte urgente',  severity: AlertSeverity.CRITICAL, location: 'Parc Montrouge'     },
      { binId: 'B-007', message: 'Niveau critique atteint (93%)',        severity: AlertSeverity.CRITICAL, location: 'École Jules Ferry'  },
      { binId: 'B-001', message: 'Taux de remplissage élevé (85%)',      severity: AlertSeverity.WARNING,  location: 'Place de la Mairie' },
      { binId: 'B-005', message: 'Capteur : odeur détectée',             severity: AlertSeverity.WARNING,  location: 'Avenue des Fleurs'  },
    ];
    for (const a of alerts) await alertRepo.save(alertRepo.create(a));
    console.log(`✔ ${alerts.length} alertes insérées.`);
  }

  // Collectes sur 30 jours pour remplir les graphiques
  const colRepo = AppDataSource.getRepository(Collection);
  const colCount = await colRepo.count();
  if (colCount === 0) {
    const types = [
      { type: WasteType.PLASTIQUE, base: 185 },
      { type: WasteType.VERRE,     base: 120 },
      { type: WasteType.PAPIER,    base: 155 },
      { type: WasteType.METAL,     base:  58 },
      { type: WasteType.ORGANIQUE, base: 102 },
    ];
    const binIds = ['B-001','B-002','B-003','B-004','B-005','B-006','B-007','B-008'];
    let total = 0;

    for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
      const day = new Date();
      day.setDate(day.getDate() - daysAgo);
      day.setHours(10, 0, 0, 0);

      for (const { type, base } of types) {
        const weight = Math.round((base + (Math.random() - 0.5) * base * 0.4) * 10) / 10;
        const binId  = binIds[Math.floor(Math.random() * binIds.length)];
        await colRepo.save(colRepo.create({
          binId,
          wasteType:   type,
          weightKg:    weight,
          collectedBy: 'Équipe A',
          collectedAt: new Date(day),
        }));
        total++;
      }
    }
    console.log(`✔ ${total} collectes insérées (30 jours).`);
  } else {
    console.log(`ℹ Collectes déjà présentes (${colCount}), ignorées.`);
  }

  await AppDataSource.destroy();
  console.log('\nSeed terminé.');
}

seed().catch(e => { console.error(e); process.exit(1); });
