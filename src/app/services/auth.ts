import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router
  ) {}

  // -----------------------------
  // Check authentication
  // -----------------------------

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // -----------------------------
  // Get token
  // -----------------------------

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // -----------------------------
  // Get logged-in user
  // -----------------------------

  getUser(): any | null {

    const user = localStorage.getItem('auth_user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  // -----------------------------
  // Logout
  // -----------------------------

  logout(): void {

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    this.router.navigate(['/']);
  }
}