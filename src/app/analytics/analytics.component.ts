import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-analytics', templateUrl: './analytics.component.html', styleUrls: ['./analytics.component.scss'] })
export class AnalyticsComponent implements OnInit {
  stats: any = null; byType: any[] = []; loading = true;
  constructor(private http: HttpClient) {}
  ngOnInit() { this.http.get<any>(`${environment.apiUrl}/analytics/dashboard`).subscribe({ next: (s: any) => { this.stats = s; this.byType = s.wasteTypes || []; this.loading = false; }, error: () => { this.loading = false; } }); }
  capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
}
