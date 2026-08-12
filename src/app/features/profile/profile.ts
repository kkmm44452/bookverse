import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  favorites = 0;
  library = 0;

  constructor(
    public authService: AuthService,
    public router: Router
  ) {
    this.loadStats();
  }

  get user() {
    return this.authService.user();
  }

  loadStats(): void {

    const fav = localStorage.getItem('favorites');
    const lib = localStorage.getItem('library');

    try {
      this.favorites = fav
        ? JSON.parse(fav).length
        : 0;
    } catch {
      this.favorites = 0;
    }

    try {
      this.library = lib
        ? JSON.parse(lib).length
        : 0;
    } catch {
      this.library = 0;
    }
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/']);
  }
}