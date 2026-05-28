import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_KEY  = 'ts_access';
  private readonly REFRESH_KEY = 'ts_refresh';

  private currentUser$ = new BehaviorSubject<CurrentUser | null>(null);
  user$ = this.currentUser$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.tryLoadUser();
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  get isLoggedIn(): boolean {
    const token = this.accessToken;
    if (!token) return false;
    // Vérifie que le token n'est pas expiré en lisant le payload localement
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  login(email: string, password: string): Observable<AuthTokens> {
    return this.http
      .post<AuthTokens>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(tokens => this.storeTokens(tokens)));
  }

  refresh(): Observable<AuthTokens> {
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    return this.http
      .post<AuthTokens>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(tap(tokens => this.storeTokens(tokens)));
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe();
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  me(): Observable<CurrentUser> {
    return this.http
      .get<CurrentUser>(`${environment.apiUrl}/auth/me`)
      .pipe(tap(user => this.currentUser$.next(user)));
  }

  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_KEY, tokens.refreshToken);
    // Décode le payload localement pour éviter un appel réseau inutile
    this.loadUserFromToken(tokens.accessToken);
  }

  private loadUserFromToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Le payload contient sub/email/role — on les utilise directement
      this.currentUser$.next({ id: payload.sub, email: payload.email, name: payload.name ?? payload.email, role: payload.role });
    } catch {
      // Token malformé — on efface
      this.clearTokens();
    }
  }

  private clearTokens(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.currentUser$.next(null);
  }

  private tryLoadUser(): void {
    const token = this.accessToken;
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expired = payload.exp * 1000 < Date.now();
      if (!expired) {
        // Token encore valide : on charge l'utilisateur localement, sans appel réseau
        this.currentUser$.next({ id: payload.sub, email: payload.email, name: payload.name ?? payload.email, role: payload.role });
      } else {
        // Token expiré : on utilise le refresh token pour en avoir un nouveau
        this.refresh().subscribe({
          error: () => this.clearTokens(),
        });
      }
    } catch {
      this.clearTokens();
    }
  }
}
