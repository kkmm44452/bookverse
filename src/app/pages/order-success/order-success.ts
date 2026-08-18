import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { finalize } from 'rxjs';

interface Order {

  id: string;

  user_id: string;

  address_id: string;

  order_number: string;


  // -----------------------------
  // PRICE BREAKDOWN
  // -----------------------------

  subtotal_amount: string | number;

  delivery_charge: string | number;

  handling_charge: string | number;

  convenience_charge: string | number;

  packaging_charge: string | number;

  sgst_charge: string | number;

  cgst_charge: string | number;

  total_amount: string | number;


  // -----------------------------
  // ORDER / PAYMENT
  // -----------------------------

  currency: string;

  payment_status: string;

  order_status: string;

  razorpay_order_id: string;

  created_at: string;

  updated_at: string;

}

interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

@Component({
  selector: 'app-order-success',
  standalone: true,

  imports: [
    CommonModule,
    DatePipe
  ],

  templateUrl: './order-success.html',
  styleUrl: './order-success.scss'
})
export class OrderSuccess implements OnInit {

  orderId = '';

  order: Order | null = null;

  loading = true;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.orderId = params['orderId'] || '';

      // console.log(
      //   'Order ID from URL:',
      //   this.orderId
      // );

      if (!this.orderId) {

        this.loading = false;

        this.errorMessage =
          'Order ID is missing.';

        this.cdr.detectChanges();

        return;
      }

      this.getOrder();

    });

  }


  getOrder(): void {

    this.loading = true;
    this.errorMessage = '';

    // console.log(
    //   'Fetching order:',
    //   this.orderId
    // );

    const token =
      localStorage.getItem('token');

    let headers = new HttpHeaders();

    if (token) {

      headers = headers.set(
        'Authorization',
        `Bearer ${token}`
      );

    }

    this.http
      .get<OrderResponse>(
        `/api/order/get?orderId=${encodeURIComponent(this.orderId)}`,
        {
          headers
        }
      )
      .pipe(

        finalize(() => {

          console.log(
            'Finished loading order'
          );

          this.loading = false;

          this.cdr.detectChanges();

        })

      )
      .subscribe({

        next: (response) => {

          console.log(
            'Order API response:',
            response
          );

          if (
            response &&
            response.success &&
            response.order
          ) {

            this.order =
              response.order;

            console.log(
              'ORDER SET IN UI:',
              this.order
            );

          } else {

            this.order = null;

            this.errorMessage =
              response?.message ||
              'Order details not found.';

          }

        },

        error: (error) => {

          console.error(
            'Get order API error:',
            error
          );

          this.order = null;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load order details.';

        }

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