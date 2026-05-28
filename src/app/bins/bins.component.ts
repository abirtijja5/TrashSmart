import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-bins', templateUrl: './bins.component.html', styleUrls: ['./bins.component.scss'] })
export class BinsComponent implements OnInit {
  bins: any[] = []; loading = true; searchQuery = ''; activeTab: 'all'|'critical'|'warning'|'normal' = 'all';
  constructor(private http: HttpClient) {}
  ngOnInit() { this.load(); }
  load() { this.loading = true; this.http.get<any[]>(`${environment.apiUrl}/bins`).subscribe({ next: (b: any[]) => { this.bins = b; this.loading = false; }, error: () => { this.loading = false; } }); }
  get filtered() {
    let b = this.bins;
    if (this.activeTab !== 'all') b = b.filter((x: any) => x.status === this.activeTab);
    if (this.searchQuery.trim()) { const q = this.searchQuery.toLowerCase(); b = b.filter((x: any) => x.id.toLowerCase().includes(q) || x.location.toLowerCase().includes(q)); }
    return b;
  }
  count(s: string) { return this.bins.filter((b: any) => b.status === s).length; }
  getFillColor(l: number) { return l >= 90 ? '#E24B4A' : l >= 70 ? '#EF9F27' : '#1D9E75'; }
  getStatusClass(s: string) { return ({normal:'badge-success',warning:'badge-warning',critical:'badge-danger'} as any)[s] ?? ''; }
  getStatusLabel(s: string) { return ({normal:'Normal',warning:'Avertissement',critical:'Critique'} as any)[s] ?? s; }
  capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
  fmt(d: any) { return d ? new Date(d).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : '—'; }
}
