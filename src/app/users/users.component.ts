import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-users', templateUrl: './users.component.html', styleUrls: ['./users.component.scss'] })
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;

  showUserModal   = false;
  showDeleteModal = false;
  saving = false;
  editingUser:  any = null;
  deletingUser: any = null;

  form: any = { email: '', name: '', password: '', role: 'operator' };
  toast: { msg: string; ok: boolean } | null = null;

  readonly ROLES = [
    { value: 'admin',    label: 'Administrateur' },
    { value: 'operator', label: 'Opérateur' },
    { value: 'viewer',   label: 'Lecteur' },
  ];

  constructor(private http: HttpClient) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe({
      next: u => { this.users = u; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  openNew() {
    this.editingUser = null;
    this.form = { email: '', name: '', password: '', role: 'operator' };
    this.showUserModal = true;
  }

  openEdit(user: any) {
    this.editingUser = user;
    this.form = { email: user.email, name: user.name, password: '', role: user.role };
    this.showUserModal = true;
  }

  saveUser() {
    if (!this.form.email.trim() || !this.form.name.trim()) return;
    if (!this.editingUser && !this.form.password.trim()) return;
    this.saving = true;
    const body: any = { email: this.form.email, name: this.form.name, role: this.form.role };
    if (this.form.password.trim()) body.password = this.form.password;

    const req = this.editingUser
      ? this.http.patch(`${environment.apiUrl}/users/${this.editingUser.id}`, body)
      : this.http.post(`${environment.apiUrl}/users`, body);
    req.subscribe({
      next: () => { this.showUserModal = false; this.saving = false; this.load(); this.notify(this.editingUser ? 'Utilisateur modifié' : 'Utilisateur créé', true); },
      error: () => { this.saving = false; this.notify('Erreur lors de la sauvegarde', false); },
    });
  }

  openDelete(user: any) { this.deletingUser = user; this.showDeleteModal = true; }

  confirmDelete() {
    this.saving = true;
    this.http.delete(`${environment.apiUrl}/users/${this.deletingUser.id}`).subscribe({
      next: () => { this.showDeleteModal = false; this.saving = false; this.load(); this.notify('Utilisateur supprimé', true); },
      error: () => { this.saving = false; this.notify('Erreur lors de la suppression', false); },
    });
  }

  notify(msg: string, ok: boolean) {
    this.toast = { msg, ok };
    setTimeout(() => this.toast = null, 3000);
  }

  getRoleLabel(r: string) { return ({admin:'Administrateur', operator:'Opérateur', viewer:'Lecteur'} as any)[r] ?? r; }
  getRoleClass(r: string) { return ({admin:'role-admin', operator:'role-op', viewer:'role-viewer'} as any)[r] ?? ''; }
  fmtDate(d: any) { return d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'; }
  initials(name: string) { return (name || '?').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0,2); }
}
