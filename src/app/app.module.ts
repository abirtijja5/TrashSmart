import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }          from './app.component';
import { LayoutComponent }       from './layout/layout.component';
import { LoginComponent }        from './auth/login/login.component';
import { DashboardComponent }    from './dashboard/dashboard.component';
import { BinsComponent }         from './bins/bins.component';
import { CollectionsComponent }  from './collections/collections.component';
import { AnalyticsComponent }    from './analytics/analytics.component';
import { AlertsComponent }       from './alerts/alerts.component';
import { UsersComponent }        from './users/users.component';
import { SettingsComponent }     from './settings/settings.component';

import { AuthInterceptor }  from './auth/interceptors/auth.interceptor';
import { AuthGuard }        from './auth/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '',            redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',   component: DashboardComponent   },
      { path: 'bins',        component: BinsComponent        },
      { path: 'collections', component: CollectionsComponent },
      { path: 'analytics',   component: AnalyticsComponent   },
      { path: 'alerts',      component: AlertsComponent      },
      { path: 'users',       component: UsersComponent       },
      { path: 'settings',    component: SettingsComponent    },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  declarations: [
    AppComponent, LayoutComponent, LoginComponent,
    DashboardComponent, BinsComponent, CollectionsComponent,
    AnalyticsComponent, AlertsComponent, UsersComponent, SettingsComponent,
  ],
  imports: [
    BrowserModule, CommonModule, HttpClientModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    DecimalPipe, DatePipe,
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
