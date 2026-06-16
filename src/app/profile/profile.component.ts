import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  loading = true;
  saving  = false;
  editing = false;
  toast: { msg: string; ok: boolean } | null = null;

  appUser:  any = null;
  profile:  any = null;

  form: any = {
    firstName: '',
    lastName: '',
    phone: '',
    isLocationAccepted: false,
    pushNotificationsEnabled: false,
  };

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const username = this.currentUsername;
    if (!username) { this.loading = false; return; }

    this.http.get<any>(`${environment.apiUrl}/auth/user/${username}`).pipe(
      switchMap(user => {
        this.appUser = user;
        return this.http.get<any>(`${environment.apiUrl}/profiles/user/${user.id}`);
      }),
    ).subscribe({
      next: profile => {
        this.profile = profile;
        this.resetForm();
        this.loading = false;
      },
      error: () => {
        this.profile = null;
        this.loading = false;
      },
    });
  }

  get currentUsername(): string {
    const token = this.auth.accessToken;
    if (!token) return '';
    try { return JSON.parse(atob(token.split('.')[1])).sub ?? ''; } catch { return ''; }
  }

  get initials(): string {
    const f = this.form.firstName || this.appUser?.username || '?';
    const l = this.form.lastName || '';
    return ((f[0] ?? '') + (l[0] ?? '')).toUpperCase() || f[0].toUpperCase();
  }

  resetForm(): void {
    this.form = {
      firstName:               this.profile?.firstName ?? '',
      lastName:                this.profile?.lastName  ?? '',
      phone:                   this.profile?.phone     ?? '',
      isLocationAccepted:      this.profile?.locationAccepted ?? this.profile?.isLocationAccepted ?? false,
      pushNotificationsEnabled: this.profile?.pushNotificationsEnabled ?? false,
    };
  }

  startEdit(): void  { this.editing = true; }
  cancelEdit(): void { this.resetForm(); this.editing = false; }

  save(): void {
    if (!this.appUser) return;
    this.saving = true;
    const payload = { ...this.form, appUserId: this.appUser.id };

    const req = this.profile
      ? this.http.put(`${environment.apiUrl}/profiles/user/${this.appUser.id}`, payload)
      : this.http.post(`${environment.apiUrl}/profiles`, payload);

    req.subscribe({
      next: (p: any) => {
        this.profile = p;
        this.editing = false;
        this.saving  = false;
        this.notify('Profil mis à jour', true);
      },
      error: () => { this.saving = false; this.notify('Erreur lors de la sauvegarde', false); },
    });
  }

  notify(msg: string, ok: boolean): void {
    this.toast = { msg, ok };
    setTimeout(() => this.toast = null, 3000);
  }

  get rewardLevel(): string {
    const pts = this.profile?.rewardPoints ?? 0;
    if (pts >= 500) return 'Or';
    if (pts >= 200) return 'Argent';
    return 'Bronze';
  }

  get rewardColor(): string {
    const pts = this.profile?.rewardPoints ?? 0;
    if (pts >= 500) return '#EF9F27';
    if (pts >= 200) return '#888780';
    return '#CD7F32';
  }

  get rewardProgress(): number {
    const pts = this.profile?.rewardPoints ?? 0;
    if (pts >= 500) return 100;
    if (pts >= 200) return Math.round((pts - 200) / 3);
    return Math.round(pts / 2);
  }
}
