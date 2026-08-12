import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,

  imports: [
    DatePipe
  ],

  templateUrl: './order-success.html',
  styleUrl: './order-success.scss'
})
export class OrderSuccess implements OnInit {

  orderId = '';

  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.orderId =
        params['orderId'] || '';

    });

  }

  printReceipt(): void {

    window.print();

  }

  continueShopping(): void {

    this.router.navigate(['/']);

  }

  viewOrders(): void {

    this.router.navigate(['/orders']);

  }

}