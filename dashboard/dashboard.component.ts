import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { WasteService } from '../services/waste.service';
import { WasteStats, WeeklyData, EfficiencyData, BinStatus, AlertEvent } from '../models/waste.model';
import { forkJoin, interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('donutCanvas')  donutCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas')    barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas')   lineCanvas!: ElementRef<HTMLCanvasElement>;

  stats!: WasteStats;
  weeklyData: WeeklyData[] = [];
  efficiencyTrend: EfficiencyData[] = [];
  binStatuses: BinStatus[] = [];
  alerts: AlertEvent[] = [];

  donutChart?: Chart;
  barChart?: Chart;
  lineChart?: Chart;

  lastRefresh = new Date();
  private refreshSub?: Subscription;

  constructor(private wasteService: WasteService) {}

  ngOnInit(): void {
    this.loadData();
    // Auto-refresh every 30 seconds
    this.refreshSub = interval(30_000).subscribe(() => this.loadData());
  }

  ngAfterViewInit(): void {
    // Charts are built after data loads in loadData()
  }

  loadData(): void {
    forkJoin({
      stats:      this.wasteService.getGlobalStats(),
      weekly:     this.wasteService.getWeeklyData(),
      efficiency: this.wasteService.getEfficiencyTrend(),
      bins:       this.wasteService.getBinStatuses(),
      alerts:     this.wasteService.getRecentAlerts()
    }).subscribe(({ stats, weekly, efficiency, bins, alerts }) => {
      this.stats         = stats;
      this.weeklyData    = weekly;
      this.efficiencyTrend = efficiency;
      this.binStatuses   = bins;
      this.alerts        = alerts;
      this.lastRefresh   = new Date();
      setTimeout(() => this.buildCharts(), 0);
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
        labels: this.stats.wasteTypes.map(w => w.type),
        datasets: [{
          data:            this.stats.wasteTypes.map(w => w.kg),
          backgroundColor: this.stats.wasteTypes.map(w => w.color),
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} kg (${this.stats.wasteTypes[ctx.dataIndex].percent}%)`
            }
          }
        }
      }
    });
  }

  private buildBar(): void {
    if (this.barChart) this.barChart.destroy();
    const ctx = this.barCanvas.nativeElement.getContext('2d')!;
    const days = this.weeklyData.map(d => d.day);
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [
          { label: 'Plastique',  data: this.weeklyData.map(d => d.plastique), backgroundColor: '#1D9E75', borderRadius: 4, borderSkipped: false },
          { label: 'Verre',      data: this.weeklyData.map(d => d.verre),     backgroundColor: '#378ADD', borderRadius: 4, borderSkipped: false },
          { label: 'Papier',     data: this.weeklyData.map(d => d.papier),    backgroundColor: '#EF9F27', borderRadius: 4, borderSkipped: false },
          { label: 'Métal',      data: this.weeklyData.map(d => d.metal),     backgroundColor: '#D4537E', borderRadius: 4, borderSkipped: false },
          { label: 'Organique',  data: this.weeklyData.map(d => d.organique), backgroundColor: '#639922', borderRadius: 4, borderSkipped: false },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: '#888780' } },
          y: { stacked: true, grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { color: '#888780', callback: (v) => `${v} kg` } }
        }
      }
    });
  }

  private buildLine(): void {
    if (this.lineChart) this.lineChart.destroy();
    const ctx = this.lineCanvas.nativeElement.getContext('2d')!;
    // Show only every 5th label to avoid crowding
    const labels = this.efficiencyTrend.map((d, i) => i % 5 === 0 ? d.date : '');
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Efficacité (%)',
          data: this.efficiencyTrend.map(d => d.efficiency),
          borderColor: '#1D9E75',
          backgroundColor: 'rgba(29,158,117,0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
          borderWidth: 2,
          pointBackgroundColor: '#1D9E75'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#888780' } },
          y: {
            min: 65, max: 100,
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: { color: '#888780', callback: (v) => `${v}%` }
          }
        }
      }
    });
  }

  getStatusClass(status: string): string {
    return { normal: 'badge-success', warning: 'badge-warning', critical: 'badge-danger' }[status] || '';
  }

  getStatusLabel(status: string): string {
    return { normal: 'Normal', warning: 'Avertissement', critical: 'Critique' }[status] || status;
  }

  getFillColor(level: number): string {
    if (level >= 90) return '#E24B4A';
    if (level >= 70) return '#EF9F27';
    return '#1D9E75';
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
    this.donutChart?.destroy();
    this.barChart?.destroy();
    this.lineChart?.destroy();
  }
}
