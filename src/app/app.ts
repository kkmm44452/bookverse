import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Footer } from './layout/footer/footer';
import { Sidenav } from './layout/sidenav/sidenav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar,Footer, Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bookverse');
}
