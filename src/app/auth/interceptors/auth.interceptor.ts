import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshToken$ = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.accessToken;
    const authReq = token ? this.addToken(req, token) : req;
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse && err.status === 401 && token) {
          return this.handle401(req, next);
        }
        return throwError(() => err);
      }),
    );
  }

  private addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      return this.refreshToken$.pipe(
        filter((t: string | null) => t !== null),
        take(1),
        switchMap((t: string | null) => next.handle(this.addToken(req, t!))),
      );
    }
    this.isRefreshing = true;
    this.refreshToken$.next(null);
    return this.auth.refresh().pipe(
      switchMap(tokens => {
        this.isRefreshing = false;
        this.refreshToken$.next(tokens.accessToken);
        return next.handle(this.addToken(req, tokens.accessToken));
      }),
      catchError(err => {
        this.isRefreshing = false;
        this.auth.logout();
        return throwError(() => err);
      }),
    );
  }
}
