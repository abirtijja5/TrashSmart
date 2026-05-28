import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-collections', templateUrl: './collections.component.html', styleUrls: ['./collections.component.scss'] })
export class CollectionsComponent implements OnInit {
  collections: any[] = []; loading = true;
  constructor(private http: HttpClient) {}
  ngOnInit() { this.load(); }
  load() { this.loading = true; this.http.get<any[]>(`${environment.apiUrl}/collections`).subscribe({ next: (c: any[]) => { this.collections = c; this.loading = false; }, error: () => { this.loading = false; } }); }
  capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
  fmtDate(d: any) { return d ? new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'; }
  get totalKg() { return this.collections.reduce((s: number, c: any) => s + (c.weightKg || 0), 0).toFixed(1); }
}
