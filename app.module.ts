import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  // To add later:
  // { path: 'bins',        loadChildren: () => import('./bins/bins.module').then(m => m.BinsModule) },
  // { path: 'collections', loadChildren: () => import('./collections/collections.module').then(m => m.CollectionsModule) },
  // { path: 'analytics',   loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule) },
  // { path: 'alerts',      loadChildren: () => import('./alerts/alerts.module').then(m => m.AlertsModule) },
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [DecimalPipe, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
