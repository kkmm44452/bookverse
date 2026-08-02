import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {

  isOpen = false;


  toggle(){

    this.isOpen = !this.isOpen;

  }


  close(){

    this.isOpen = false;

  }


}