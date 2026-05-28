import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-bins', templateUrl: './bins.component.html', styleUrls: ['./bins.component.scss'] })
export class BinsComponent implements OnInit {
  bins: any[] = [];
  loading = true;
  searchQuery = '';
  activeTab: 'all' | 'critical' | 'warning' | 'normal' = 'all';

  showBinModal    = false;
  showDeleteModal = false;
  showPlanModal   = false;
  saving = false;
  editingBin:  any = null;
  deletingBin: any = null;
  planningBin: any = null;

  binForm:  any = { id: '', location: '', type: 'plastique', fillLevel: 0 };
  planForm: any = { weightKg: '', collectedBy: '', notes: '' };
  toast: { msg: string; ok: boolean } | null = null;

  readonly TYPES = ['plastique','verre','papier','metal','organique'];

  constructor(private http: HttpClient) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/bins`).subscribe({
      next: b => { this.bins = b; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  get filtered() {
    let b = this.bins;
    if (this.activeTab !== 'all') b = b.filter(x => x.status === this.activeTab);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      b = b.filter(x => x.id.toLowerCase().includes(q) || x.location.toLowerCase().includes(q));
    }
    return b;
  }

  count(s: string) { return this.bins.filter(b => b.status === s).length; }

  openNew() {
    this.editingBin = null;
    this.binForm = { id: '', location: '', type: 'plastique', fillLevel: 0 };
    this.showBinModal = true;
  }

  openEdit(bin: any) {
    this.editingBin = bin;
    this.binForm = { id: bin.id, location: bin.location, type: bin.type, fillLevel: bin.fillLevel };
    this.showBinModal = true;
  }

  saveBin() {
    if (!this.binForm.location.trim()) return;
    this.saving = true;
    const req = this.editingBin
      ? this.http.patch(`${environment.apiUrl}/bins/${this.editingBin.id}`, { location: this.binForm.location, type: this.binForm.type, fillLevel: +this.binForm.fillLevel })
      : this.http.post(`${environment.apiUrl}/bins`, { ...this.binForm, fillLevel: +this.binForm.fillLevel });
    req.subscribe({
      next: () => { this.showBinModal = false; this.saving = false; this.load(); this.notify(this.editingBin ? 'Poubelle modifiée' : 'Poubelle créée', true); },
      error: () => { this.saving = false; this.notify('Erreur lors de la sauvegarde', false); },
    });
  }

  openDelete(bin: any) { this.deletingBin = bin; this.showDeleteModal = true; }

  confirmDelete() {
    this.saving = true;
    this.http.delete(`${environment.apiUrl}/bins/${this.deletingBin.id}`).subscribe({
      next: () => { this.showDeleteModal = false; this.saving = false; this.load(); this.notify('Poubelle supprimée', true); },
      error: () => { this.saving = false; this.notify('Erreur lors de la suppression', false); },
    });
  }

  openPlan(bin: any) {
    this.planningBin = bin;
    this.planForm = { weightKg: '', collectedBy: '', notes: '' };
    this.showPlanModal = true;
  }

  savePlan() {
    if (!this.planForm.weightKg) return;
    this.saving = true;
    this.http.post(`${environment.apiUrl}/collections`, {
      binId:       this.planningBin.id,
      wasteType:   this.planningBin.type,
      weightKg:    +this.planForm.weightKg,
      collectedBy: this.planForm.collectedBy || 'Équipe A',
      notes:       this.planForm.notes,
      collectedAt: new Date().toISOString(),
    }).subscribe({
      next: () => { this.showPlanModal = false; this.saving = false; this.load(); this.notify('Collecte enregistrée ✓', true); },
      error: () => { this.saving = false; this.notify('Erreur lors de l\'enregistrement', false); },
    });
  }

  notify(msg: string, ok: boolean) {
    this.toast = { msg, ok };
    setTimeout(() => this.toast = null, 3000);
  }

  getFillColor(l: number) { return l >= 90 ? '#E24B4A' : l >= 70 ? '#EF9F27' : '#1D9E75'; }
  getStatusClass(s: string) { return ({normal:'badge-success',warning:'badge-warning',critical:'badge-danger'} as any)[s] ?? ''; }
  getStatusLabel(s: string) { return ({normal:'Normal',warning:'Avertissement',critical:'Critique'} as any)[s] ?? s; }
  capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
  fmt(d: any) { return d ? new Date(d).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : '—'; }
}
