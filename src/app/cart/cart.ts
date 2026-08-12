import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from '../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {

  public cartService = inject(CartService);

  private router = inject(Router);

  goBack(): void {
    this.router.navigate(['/']);
  }

  continueShopping(): void {
    this.router.navigate(['/school-books']);
  }

  checkout(): void {

    if (this.cartService.cartCount() === 0) {
      return;
    }

    this.router.navigate(['/checkout']);
  }


}