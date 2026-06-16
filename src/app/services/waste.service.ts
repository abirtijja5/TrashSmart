import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { WasteStats, BinStatus, AlertEvent, WeeklyData, EfficiencyData } from '../models/waste.model';

const WASTE_COLORS: Record<string, string> = {
  PLASTIC: '#1D9E75', GLASS: '#378ADD', PAPER: '#EF9F27',
  METAL: '#D4537E', ORGANIC: '#639922', OTHER: '#888780',
};
const WASTE_LABELS: Record<string, string> = {
  PLASTIC: 'Plastique', GLASS: 'Verre', PAPER: 'Papier',
  METAL: 'Métal', ORGANIC: 'Organique', OTHER: 'Autre',
};
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

@Injectable({ providedIn: 'root' })
export class WasteService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private rawTrashcans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/trashcans`);
  }
  private rawWastes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/wastes`);
  }
  private rawAlerts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/alerts`);
  }

  getGlobalStats(): Observable<WasteStats> {
    return forkJoin({ trashcans: this.rawTrashcans(), wastes: this.rawWastes(), alerts: this.rawAlerts() }).pipe(
      map(({ trashcans, wastes, alerts }) => {
        const totalKg = wastes.reduce((s: number, w: any) => s + (w.weight ?? 0), 0);
        const byType: Record<string, number> = {};
        wastes.forEach((w: any) => { byType[w.wasteType] = (byType[w.wasteType] ?? 0) + (w.weight ?? 0); });
        const sorted = ['PLASTIC', 'GLASS', 'PAPER', 'METAL', 'ORGANIC', 'OTHER']
          .filter(t => byType[t])
          .map(t => ({ type: WASTE_LABELS[t], kg: Math.round(byType[t] * 10) / 10, percent: totalKg ? Math.round(byType[t] / totalKg * 100) : 0, color: WASTE_COLORS[t], icon: '' }));
        const fullBins = trashcans.filter((b: any) => b.full || b.isFull || b.fillLevel >= 90).length;
        return {
          totalCollected: Math.round(totalKg * 10) / 10,
          sortingEfficiency: totalKg ? Math.round((wastes.filter((w: any) => w.wasteType !== 'OTHER').reduce((s: number, w: any) => s + w.weight, 0) / totalKg) * 100) : 0,
          activeBins: trashcans.length,
          fullBins,
          alertsCount: alerts.filter((a: any) => !a.acknowledged && !a.isAcknowledged).length,
          co2Saved: Math.round(totalKg * 0.5 * 10) / 10,
          wasteTypes: sorted,
        };
      }),
    );
  }

  getWeeklyData(): Observable<WeeklyData[]> {
    return this.rawWastes().pipe(
      map((wastes: any[]) => {
        const result: WeeklyData[] = DAYS.map(day => ({ day, plastique: 0, verre: 0, papier: 0, metal: 0, organique: 0 }));
        wastes.forEach((w: any) => {
          const d = new Date(w.depositDate ?? w.deposit_date);
          const idx = (d.getDay() + 6) % 7;
          const kg = w.weight ?? 0;
          if (w.wasteType === 'PLASTIC')  result[idx].plastique  += kg;
          if (w.wasteType === 'GLASS')    result[idx].verre      += kg;
          if (w.wasteType === 'PAPER')    result[idx].papier     += kg;
          if (w.wasteType === 'METAL')    result[idx].metal      += kg;
          if (w.wasteType === 'ORGANIC')  result[idx].organique  += kg;
        });
        return result;
      }),
    );
  }

  getEfficiencyTrend(): Observable<EfficiencyData[]> {
    return this.rawWastes().pipe(
      map((wastes: any[]) => {
        const byDay: Record<string, { total: number; sorted: number }> = {};
        wastes.forEach((w: any) => {
          const key = new Date(w.depositDate ?? w.deposit_date).toLocaleDateString('fr-FR');
          if (!byDay[key]) byDay[key] = { total: 0, sorted: 0 };
          byDay[key].total += w.weight ?? 0;
          if (w.wasteType !== 'OTHER') byDay[key].sorted += w.weight ?? 0;
        });
        return Object.entries(byDay).slice(-30).map(([date, v]) => ({
          date,
          efficiency: v.total ? Math.round(v.sorted / v.total * 100) : 0,
        }));
      }),
    );
  }

  getBinStatuses(): Observable<BinStatus[]> {
    return this.rawTrashcans().pipe(
      map((bins: any[]) => bins.map(b => ({
        id:         b.reference ?? String(b.id),
        location:   b.locationName ?? b.location_name ?? '—',
        type:       'mixte',
        fillLevel:  b.fillLevel ?? b.fill_level ?? 0,
        status:     (b.isBlocked || b.is_blocked) ? 'critical' : ((b.isFull || b.is_full) || (b.fillLevel ?? b.fill_level ?? 0) >= 90) ? 'warning' : 'normal',
        lastUpdate: null,
      }))),
    );
  }

  getRecentAlerts(): Observable<AlertEvent[]> {
    return this.rawAlerts().pipe(
      map((alerts: any[]) => alerts.map(a => ({
        id:             a.id,
        binId:          a.trashcanReference ?? a.trashcan_reference ?? String(a.trashcanId ?? ''),
        message:        a.description ?? '',
        severity:       a.severity === 'CRITICAL' ? 'critical' : 'warning',
        createdAt:      a.createdAt ?? a.created_at,
        location:       a.trashcanReference ?? '',
        acknowledgedAt: a.acknowledgedAt ?? null,
      }))),
    );
  }
}
