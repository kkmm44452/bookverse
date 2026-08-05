import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Menu } from '../../core/services/menu';
import { SearchService } from '../../core/services/search';

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
    private searchService: SearchService

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


  openProfile() {

    if (this.router.url === '/profile') {

      this.router.navigate(['/']);

    }
    else {

      this.router.navigate(['/profile']);

    }

  }


}