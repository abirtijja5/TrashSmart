import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  Chart,
  ArcElement, DoughnutController,
  BarElement, BarController,
  LineElement, LineController, PointElement,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
  registerables,
} from 'chart.js';
import { WasteService } from '../services/waste.service';
import { AuthService } from '../auth/auth.service';
import { WasteStats, WeeklyData, EfficiencyData, BinStatus, AlertEvent } from '../models/waste.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas')   barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas')  lineCanvas!: ElementRef<HTMLCanvasElement>;

  stats: WasteStats | null = null;
  weeklyData: WeeklyData[] = [];
  efficiencyTrend: EfficiencyData[] = [];
  binStatuses: BinStatus[] = [];
  alerts: AlertEvent[] = [];
  loading = true;
  activeTab: 'all' | 'critical' | 'warning' | 'normal' = 'all';
  searchQuery = '';
  lastRefresh = new Date();

  private donutChart: Chart | null = null;
  private barChart: Chart | null = null;
  private lineChart: Chart | null = null;

  constructor(private waste: WasteService, private auth: AuthService) {}

  ngOnInit(): void { this.loadData(); }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.donutChart?.destroy();
    this.barChart?.destroy();
    this.lineChart?.destroy();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      stats: this.waste.getGlobalStats(),
      weekly: this.waste.getWeeklyData(),
      efficiency: this.waste.getEfficiencyTrend(),
      bins: this.waste.getBinStatuses(),
      alerts: this.waste.getRecentAlerts(),
    }).subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.weeklyData = data.weekly;
        this.efficiencyTrend = data.efficiency;
        this.binStatuses = data.bins;
        this.alerts = data.alerts;
        this.loading = false;
        this.lastRefresh = new Date();
        setTimeout(() => {
          this.buildDonut();
          this.buildBar();
          this.buildLine();
        }, 50);
      },
      error: () => { this.loading = false; },
    });
  }

  private buildDonut(): void {
    if (!this.donutCanvas || !this.stats) return;
    this.donutChart?.destroy();
    const types = this.stats.wasteTypes || [];
    this.donutChart = new Chart(this.donutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: types.map(t => this.capitalize(t.type)),
        datasets: [{
          data: types.map(t => t.kg),
          backgroundColor: types.map(t => t.color),
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6,
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
              label: ctx => ` ${ctx.label}: ${ctx.parsed.toFixed(1)} kg`,
            },
          },
        },
      },
    });
  }

  private buildBar(): void {
    if (!this.barCanvas) return;
    this.barChart?.destroy();
    const labels = this.weeklyData.map(d => d.day);
    const colors = {
      plastique: '#4B9EF5', verre: '#1D9E75', papier: '#F5A623',
      metal: '#9B59B6', organique: '#E87E4D',
    };
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Plastique',  data: this.weeklyData.map(d => d.plastique),  backgroundColor: colors.plastique,  borderRadius: 4 },
          { label: 'Verre',      data: this.weeklyData.map(d => d.verre),      backgroundColor: colors.verre,      borderRadius: 4 },
          { label: 'Papier',     data: this.weeklyData.map(d => d.papier),     backgroundColor: colors.papier,     borderRadius: 4 },
          { label: 'Métal',      data: this.weeklyData.map(d => d.metal),      backgroundColor: colors.metal,      borderRadius: 4 },
          { label: 'Organique',  data: this.weeklyData.map(d => d.organique),  backgroundColor: colors.organique,  borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { stacked: true, grid: { color: '#F0F2F0' }, ticks: { font: { size: 11 } } },
        },
      },
    });
  }

  private buildLine(): void {
    if (!this.lineCanvas) return;
    this.lineChart?.destroy();
    const labels = this.efficiencyTrend.map(d => {
      const dt = new Date(d.date);
      return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    });
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Efficacité (%)',
          data: this.efficiencyTrend.map(d => d.efficiency),
          borderColor: '#1D9E75',
          backgroundColor: 'rgba(29,158,117,0.08)',
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: '#1D9E75',
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 0, maxTicksLimit: 8 } },
          y: { min: 0, max: 100, grid: { color: '#F0F2F0' }, ticks: { font: { size: 11 }, callback: v => `${v}%` } },
        },
      },
    });
  }

  get filteredBins(): BinStatus[] {
    let bins = this.binStatuses;
    if (this.activeTab !== 'all') bins = bins.filter(b => b.status === this.activeTab);
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      bins = bins.filter(b => b.id.toLowerCase().includes(q) || b.location.toLowerCase().includes(q));
    }
    return bins;
  }

  countByStatus(status: string): number {
    return this.binStatuses.filter(b => b.status === status).length;
  }

  getStatusClass(s: string): string {
    const map: Record<string, string> = { normal: 'badge-success', warning: 'badge-warning', critical: 'badge-danger' };
    return map[s] ?? '';
  }

  getStatusLabel(s: string): string {
    const map: Record<string, string> = { normal: 'Normal', warning: 'Avertissement', critical: 'Critique' };
    return map[s] ?? s;
  }

  getFillColor(level: number): string {
    if (level >= 90) return '#E24B4A';
    if (level >= 70) return '#EF9F27';
    return '#1D9E75';
  }

  formatLastUpdate(d: string | Date | null): string {
    if (!d) return '—';
    const date = new Date(d as string);
    const diff = Math.round((Date.now() - date.getTime()) / 60000);
    if (diff < 1) return 'À l\'instant';
    if (diff < 60) return `Il y a ${diff} min`;
    if (diff < 1440) return `Il y a ${Math.floor(diff / 60)} h`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  formatAlertTime(d: string | Date): string {
    if (!d) return '';
    const date = new Date(d as string);
    const diff = Math.round((Date.now() - date.getTime()) / 60000);
    if (diff < 1) return 'À l\'instant';
    if (diff < 60) return `Il y a ${diff} min`;
    if (diff < 1440) return `Il y a ${Math.floor(diff / 60)} h`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  capitalize(s: string): string {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  logout(): void { this.auth.logout(); }

  get formattedDate(): string {
    return new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
}
