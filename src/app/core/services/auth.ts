import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  mobileNumber?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

export interface SignupRequest {
  name: string;
  email: string;
  mobileNumber?: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'bookverse_token';
  private readonly userKey = 'bookverse_user';

  private readonly currentUserSignal =
    signal<AuthUser | null>(this.getStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor(
    private http: HttpClient
  ) {}

  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/signup', data)
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            this.storeAuthentication(
              response.token,
              response.user
            );
          }
        })
      );
  }

  signin(data: SigninRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/signin', data)
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            this.storeAuthentication(
              response.token,
              response.user
            );
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    this.currentUserSignal.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): AuthUser | null {
    return this.currentUserSignal();
  }

  private storeAuthentication(
    token: string,
    user: AuthUser
  ): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(
      this.userKey,
      JSON.stringify(user)
    );

    this.currentUserSignal.set(user);
  }

  private getStoredUser(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}