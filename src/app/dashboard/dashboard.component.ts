import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { WasteService } from '../services/waste.service';
import { AuthService } from '../auth/auth.service';
import { WasteStats, WeeklyData, EfficiencyData, BinStatus, AlertEvent } from '../models/waste.model';
import { forkJoin, interval, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas')   barCanvas!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas')  lineCanvas!:  ElementRef<HTMLCanvasElement>;

  stats!: WasteStats;
  weeklyData: WeeklyData[] = [];
  efficiencyTrend: EfficiencyData[] = [];
  binStatuses: BinStatus[] = [];
  alerts: AlertEvent[] = [];

  donutChart?: Chart;
  barChart?: Chart;
  lineChart?: Chart;

  lastRefresh = new Date();
  loading = true;
  activeTab: 'all' | 'critical' | 'warning' | 'normal' = 'all';
  searchQuery = '';

  private refreshSub?: Subscription;

  // Modal planifier
  showPlanModal = false;
  planningBin:  any = null;
  planForm:     any = { weightKg: '', collectedBy: '', notes: '' };
  saving        = false;
  toast: { msg: string; ok: boolean } | null = null;

  readonly TYPES = ['plastique','verre','papier','metal','organique'];

  constructor(
    private wasteService: WasteService,
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  logout(): void { this.authService.logout(); }

  openPlan(bin: any): void {
    this.planningBin = bin;
    this.planForm = { weightKg: '', collectedBy: '', notes: '' };
    this.showPlanModal = true;
  }

  savePlan(): void {
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
      next: () => {
        this.showPlanModal = false;
        this.saving = false;
        this.loadData();
        this.notify('Collecte enregistrée ✓', true);
      },
      error: () => { this.saving = false; this.notify('Erreur lors de l\'enregistrement', false); },
    });
  }

  notify(msg: string, ok: boolean): void {
    this.toast = { msg, ok };
    setTimeout(() => this.toast = null, 3000);
  }

  get filteredBins(): BinStatus[] {
    let bins = this.binStatuses;
    if (this.activeTab !== 'all') {
      bins = bins.filter(b => b.status === this.activeTab);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      bins = bins.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q),
      );
    }
    return bins;
  }

  countByStatus(status: string): number {
    return this.binStatuses.filter(b => b.status === status).length;
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshSub = interval(30_000).subscribe(() => this.loadData());
  }

  ngAfterViewInit(): void {}

  loadData(): void {
    forkJoin({
      stats:      this.wasteService.getGlobalStats(),
      weekly:     this.wasteService.getWeeklyData(),
      efficiency: this.wasteService.getEfficiencyTrend(),
      bins:       this.wasteService.getBinStatuses(),
      alerts:     this.wasteService.getRecentAlerts(),
    }).subscribe({
      next: ({ stats, weekly, efficiency, bins, alerts }) => {
        this.stats           = stats;
        this.weeklyData      = weekly;
        this.efficiencyTrend = efficiency;
        this.binStatuses     = bins;
        this.alerts          = alerts;
        this.lastRefresh     = new Date();
        this.loading         = false;
        setTimeout(() => this.buildCharts(), 0);
      },
      error: () => { this.loading = false; },
    });
  }

  private buildCharts(): void {
    this.buildDonut();
    this.buildBar();
    this.buildLine();
  }

  private buildDonut(): void {
    if (this.donutChart) this.donutChart.destroy();
    const ctx = this.donutCanvas.nativeElement.getContext('2d')!;
    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.stats.wasteTypes.map(w => this.capitalize(w.type)),
        datasets: [{
          data:            this.stats.wasteTypes.map(w => w.kg),
          backgroundColor: this.stats.wasteTypes.map(w => w.color),
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => ` ${c.label}: ${c.parsed.toLocaleString('fr-FR')} kg (${this.stats.wasteTypes[c.dataIndex].percent}%)`,
            },
          },
        },
      },
    });
  }

  private buildBar(): void {
    if (this.barChart) this.barChart.destroy();
    const ctx = this.barCanvas.nativeElement.getContext('2d')!;
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.weeklyData.map(d => this.capitalize(d.day)),
        datasets: [
          { label: 'Plastique', data: this.weeklyData.map(d => d.plastique), backgroundColor: '#1D9E75', borderRadius: 3, borderSkipped: false },
          { label: 'Verre',     data: this.weeklyData.map(d => d.verre),     backgroundColor: '#378ADD', borderRadius: 3, borderSkipped: false },
          { label: 'Papier',    data: this.weeklyData.map(d => d.papier),    backgroundColor: '#EF9F27', borderRadius: 3, borderSkipped: false },
          { label: 'Métal',     data: this.weeklyData.map(d => d.metal),     backgroundColor: '#D4537E', borderRadius: 3, borderSkipped: false },
          { label: 'Organique', data: this.weeklyData.map(d => d.organique), backgroundColor: '#639922', borderRadius: 3, borderSkipped: false },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: '#888780', font: { size: 11 } } },
          y: {
            stacked: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#888780', font: { size: 11 }, callback: v => `${v} kg` },
          },
        },
      },
    });
  }

  private buildLine(): void {
    if (this.lineChart) this.lineChart.destroy();
    const ctx = this.lineCanvas.nativeElement.getContext('2d')!;
    const labels = this.efficiencyTrend.map((d, i) => i % 5 === 0 ? d.date : '');
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Efficacité (%)',
          data: this.efficiencyTrend.map(d => d.efficiency),
          borderColor: '#1D9E75',
          backgroundColor: 'rgba(29,158,117,0.07)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2,
          pointBackgroundColor: '#1D9E75',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#888780', font: { size: 10 } } },
          y: {
            min: 60, max: 100,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#888780', font: { size: 10 }, callback: v => `${v}%` },
          },
        },
      },
    });
  }

  getStatusClass(status: string): string {
    return ({ normal: 'badge-success', warning: 'badge-warning', critical: 'badge-danger' } as Record<string, string>)[status] ?? '';
  }

  getStatusLabel(status: string): string {
    return ({ normal: 'Normal', warning: 'Avertissement', critical: 'Critique' } as Record<string, string>)[status] ?? status;
  }

  getFillColor(level: number): string {
    if (level >= 90) return '#E24B4A';
    if (level >= 70) return '#EF9F27';
    return '#1D9E75';
  }

  formatLastUpdate(date: string | Date | null): string {
    if (!date) return '—';
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatAlertTime(date: string | Date): string {
    const d = new Date(date);
    const diff = Math.round((Date.now() - d.getTime()) / 60000);
    if (diff < 1)  return 'À l\'instant';
    if (diff < 60) return `Il y a ${diff} min`;
    if (diff < 1440) return `Il y a ${Math.floor(diff / 60)} h`;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
    this.donutChart?.destroy();
    this.barChart?.destroy();
    this.lineChart?.destroy();
  }
}
