import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Menu } from '../../core/services/menu';
import { SearchService } from '../../core/services/search';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart';


@Component({

  selector: 'app-navbar',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './navbar.html',

  styleUrl: './navbar.scss'

})


export class Navbar {


  searchText = '';


  constructor(

    public menu: Menu,
    private router: Router,
    private searchService: SearchService,
    public authService: AuthService,
    public cart: CartService

  ) { }



  openMenu() {

    this.menu.open();

  }



  searchBooks() {

    if (this.searchText.trim()) {

      this.searchService.search(
        this.searchText
      );

    }

  }


  // openProfile() {

  //   if (this.router.url === '/profile') {

  //     this.router.navigate(['/']);

  //   }
  //   else {

  //     this.router.navigate(['/profile']);

  //   }

  // }
openProfile(): void {

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/signin']);
    }

  }

   openCart(): void {
    this.router.navigate(['/cart']);
  }

}