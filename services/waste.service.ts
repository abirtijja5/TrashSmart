import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WasteStats, BinStatus, AlertEvent, WeeklyData, EfficiencyData } from '../models/waste.model';

@Injectable({ providedIn: 'root' })
export class WasteService {

  getGlobalStats(): Observable<WasteStats> {
    return of({
      totalCollected: 4782,         // kg collectés aujourd'hui
      sortingEfficiency: 87.4,       // % global
      activeBins: 142,
      fullBins: 23,
      alertsCount: 5,
      co2Saved: 1243,                // kg CO₂ économisés
      wasteTypes: [
        { type: 'Plastique',  kg: 1320, percent: 27.6, color: '#1D9E75', icon: 'recycle' },
        { type: 'Verre',      kg: 890,  percent: 18.6, color: '#378ADD', icon: 'droplet' },
        { type: 'Papier',     kg: 1140, percent: 23.8, color: '#EF9F27', icon: 'file-text' },
        { type: 'Métal',      kg: 430,  percent: 9.0,  color: '#D4537E', icon: 'tool' },
        { type: 'Organique',  kg: 750,  percent: 15.7, color: '#639922', icon: 'leaf' },
        { type: 'Autre',      kg: 252,  percent: 5.3,  color: '#888780', icon: 'package' },
      ]
    });
  }

  getWeeklyData(): Observable<WeeklyData[]> {
    return of([
      { day: 'Lun', plastique: 185, verre: 120, papier: 155, metal: 58, organique: 102 },
      { day: 'Mar', plastique: 210, verre: 98,  papier: 170, metal: 45, organique: 115 },
      { day: 'Mer', plastique: 178, verre: 145, papier: 130, metal: 72, organique: 98  },
      { day: 'Jeu', plastique: 195, verre: 110, papier: 160, metal: 50, organique: 130 },
      { day: 'Ven', plastique: 225, verre: 135, papier: 180, metal: 65, organique: 122 },
      { day: 'Sam', plastique: 175, verre: 165, papier: 145, metal: 68, organique: 88  },
      { day: 'Dim', plastique: 152, verre: 117, papier: 100, metal: 72, organique: 95  },
    ]);
  }

  getEfficiencyTrend(): Observable<EfficiencyData[]> {
    const days = [];
    let base = 82;
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      base = Math.min(98, Math.max(70, base + (Math.random() - 0.4) * 3));
      days.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        efficiency: Math.round(base * 10) / 10
      });
    }
    return of(days);
  }

  getBinStatuses(): Observable<BinStatus[]> {
    return of([
      { id: 'B-001', location: 'Place de la Mairie',    type: 'Plastique', fillLevel: 85, status: 'warning',  lastUpdate: '14:32' },
      { id: 'B-002', location: 'Rue du Commerce',       type: 'Verre',     fillLevel: 42, status: 'normal',   lastUpdate: '14:15' },
      { id: 'B-003', location: 'Parc Montrouge',        type: 'Papier',    fillLevel: 96, status: 'critical', lastUpdate: '14:45' },
      { id: 'B-004', location: 'Gare Centrale',         type: 'Métal',     fillLevel: 25, status: 'normal',   lastUpdate: '13:58' },
      { id: 'B-005', location: 'Avenue des Fleurs',     type: 'Organique', fillLevel: 71, status: 'warning',  lastUpdate: '14:20' },
      { id: 'B-006', location: 'Centre Commercial',     type: 'Plastique', fillLevel: 55, status: 'normal',   lastUpdate: '14:10' },
      { id: 'B-007', location: 'École Jules Ferry',     type: 'Papier',    fillLevel: 93, status: 'critical', lastUpdate: '14:50' },
      { id: 'B-008', location: 'Parking République',    type: 'Verre',     fillLevel: 18, status: 'normal',   lastUpdate: '13:40' },
    ]);
  }

  getRecentAlerts(): Observable<AlertEvent[]> {
    return of([
      { id: 1, binId: 'B-003', message: 'Poubelle pleine — collecte urgente requise',   severity: 'critical', time: 'Il y a 8 min',  location: 'Parc Montrouge'     },
      { id: 2, binId: 'B-007', message: 'Niveau critique atteint (93%)',                 severity: 'critical', time: 'Il y a 3 min',  location: 'École Jules Ferry'  },
      { id: 3, binId: 'B-001', message: 'Taux de remplissage élevé (85%)',               severity: 'warning',  time: 'Il y a 21 min', location: 'Place de la Mairie' },
      { id: 4, binId: 'B-005', message: 'Capteur : odeur détectée',                     severity: 'warning',  time: 'Il y a 35 min', location: 'Avenue des Fleurs'  },
      { id: 5, binId: 'B-012', message: 'Tentative d\'intrusion détectée',              severity: 'critical', time: 'Il y a 52 min', location: 'Rue Gambetta'       },
    ]);
  }
}
