import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { API_BASE_URL } from '../config/api.config';
import {
  AuthMeResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User
} from '../models/interfaces';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'currentUser';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    this.restoreSession();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const payload: LoginRequest = { email, password };

    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/login`, payload)
      .pipe(tap((response) => this.persistSession(response)));
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/register`, userData)
      .pipe(tap((response) => this.persistSession(response)));
  }

  getMe(): Observable<User> {
    return this.http
      .get<AuthMeResponse>(`${API_BASE_URL}/auth/me`)
      .pipe(map((response) => response.user));
  }

  restoreSession(): void {
    const token = this.getToken();
    const cachedUser = this.storage.getItem<User>(this.userKey);

    if (!token) {
      this.clearSession();
      return;
    }

    if (cachedUser) {
      this.currentUserSubject.next(cachedUser);
    }

    this.getMe()
      .pipe(
        tap((user) => {
          this.storage.setItem(this.userKey, user);
          this.currentUserSubject.next(user);
        }),
        catchError(() => {
          this.clearSession();
          return of(null);
        })
      )
      .subscribe();
  }

  logout(): void {
    this.clearSession();
  }

  getToken(): string | null {
    return this.storage.getItem<string>(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue && this.hasToken();
  }

  private persistSession(response: AuthResponse): void {
    this.storage.setItem(this.tokenKey, response.token);
    this.storage.setItem(this.userKey, response.user);
    this.currentUserSubject.next(response.user);
  }

  private clearSession(): void {
    this.storage.removeItem(this.tokenKey);
    this.storage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }
}