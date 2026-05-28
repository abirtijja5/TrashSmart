import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-collections', templateUrl: './collections.component.html', styleUrls: ['./collections.component.scss'] })
export class CollectionsComponent implements OnInit {
  collections: any[] = [];
  loading = true;
  bins: any[] = [];

  showModal = false;
  saving = false;
  form: any = { binId: '', wasteType: 'plastique', weightKg: '', collectedBy: '', notes: '' };
  toast: { msg: string; ok: boolean } | null = null;

  readonly TYPES = ['plastique','verre','papier','metal','organique'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.load();
    this.http.get<any[]>(`${environment.apiUrl}/bins`).subscribe({ next: b => this.bins = b });
  }

  load() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/collections`).subscribe({
      next: c => { this.collections = c; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  openNew() {
    this.form = { binId: this.bins[0]?.id || '', wasteType: 'plastique', weightKg: '', collectedBy: '', notes: '' };
    this.showModal = true;
  }

  save() {
    if (!this.form.binId || !this.form.weightKg) return;
    this.saving = true;
    this.http.post(`${environment.apiUrl}/collections`, {
      binId:       this.form.binId,
      wasteType:   this.form.wasteType,
      weightKg:    +this.form.weightKg,
      collectedBy: this.form.collectedBy || 'Équipe A',
      notes:       this.form.notes,
      collectedAt: new Date().toISOString(),
    }).subscribe({
      next: () => { this.showModal = false; this.saving = false; this.load(); this.notify('Collecte enregistrée ✓', true); },
      error: () => { this.saving = false; this.notify('Erreur lors de l\'enregistrement', false); },
    });
  }

  notify(msg: string, ok: boolean) {
    this.toast = { msg, ok };
    setTimeout(() => this.toast = null, 3000);
  }

  capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
  fmtDate(d: any) { return d ? new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'; }
  get totalKg() { return this.collections.reduce((s, c) => s + c.weightKg, 0).toFixed(1); }
}
