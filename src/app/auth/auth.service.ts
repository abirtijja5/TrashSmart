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
    return !!this.accessToken;
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
    this.tryLoadUser();
  }

  private clearTokens(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    this.currentUser$.next(null);
  }

  private tryLoadUser(): void {
    if (this.accessToken) {
      this.me().subscribe({ error: () => this.clearTokens() });
    }
  }
}
