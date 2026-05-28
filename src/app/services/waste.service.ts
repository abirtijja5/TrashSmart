import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WasteStats, BinStatus, AlertEvent, WeeklyData, EfficiencyData } from '../models/waste.model';

@Injectable({ providedIn: 'root' })
export class WasteService {
  private api = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getGlobalStats(): Observable<WasteStats>          { return this.http.get<WasteStats>(`${this.api}/analytics/dashboard`); }
  getWeeklyData(): Observable<WeeklyData[]>          { return this.http.get<WeeklyData[]>(`${this.api}/collections/weekly`); }
  getEfficiencyTrend(): Observable<EfficiencyData[]> { return this.http.get<EfficiencyData[]>(`${this.api}/analytics/efficiency`); }
  getBinStatuses(): Observable<BinStatus[]>          { return this.http.get<BinStatus[]>(`${this.api}/bins`); }
  getRecentAlerts(): Observable<AlertEvent[]>        { return this.http.get<AlertEvent[]>(`${this.api}/alerts/active`); }
}
