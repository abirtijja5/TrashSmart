import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-users', templateUrl: './users.component.html', styleUrls: ['./users.component.scss'] })
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe({
      next: u => { this.users = u; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  getRoleLabel(r: string) { return ({admin:'Administrateur', operator:'Opérateur', viewer:'Lecteur'} as any)[r] ?? r; }
  getRoleClass(r: string) { return ({admin:'role-admin', operator:'role-op', viewer:'role-viewer'} as any)[r] ?? ''; }
  fmtDate(d: any) { return d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'; }
  initials(name: string) { return (name || '?').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0,2); }
}
