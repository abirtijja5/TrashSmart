import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-alerts', templateUrl: './alerts.component.html', styleUrls: ['./alerts.component.scss'] })
export class AlertsComponent implements OnInit {
  alerts: any[] = [];
  loading = true;
  activeTab: 'all' | 'critical' | 'warning' = 'all';
  deletingAlert: any = null;
  showDeleteModal = false;
  saving = false;
  toast: { msg: string; ok: boolean } | null = null;

  constructor(private http: HttpClient) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/alerts`).subscribe({
      next: a => { this.alerts = a; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  get filtered() {
    if (this.activeTab === 'all') return this.alerts;
    return this.alerts.filter(a => a.severity === this.activeTab);
  }

  count(s: string) { return this.alerts.filter(a => a.severity === s).length; }

  acknowledge(id: number) {
    this.http.patch(`${environment.apiUrl}/alerts/${id}/acknowledge`, {}).subscribe(() => this.load());
  }

  openDelete(alert: any) { this.deletingAlert = alert; this.showDeleteModal = true; }

  confirmDelete() {
    this.saving = true;
    this.http.delete(`${environment.apiUrl}/alerts/${this.deletingAlert.id}`).subscribe({
      next: () => { this.showDeleteModal = false; this.saving = false; this.load(); this.notify('Alerte supprimée', true); },
      error: () => { this.saving = false; this.notify('Erreur lors de la suppression', false); },
    });
  }

  notify(msg: string, ok: boolean) {
    this.toast = { msg, ok };
    setTimeout(() => this.toast = null, 3000);
  }

  formatTime(d: any) {
    if (!d) return '';
    const date = new Date(d);
    const diff = Math.round((Date.now() - date.getTime()) / 60000);
    if (diff < 1)    return 'À l\'instant';
    if (diff < 60)   return `Il y a ${diff} min`;
    if (diff < 1440) return `Il y a ${Math.floor(diff/60)} h`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}
