// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { DecimalPipe } from '@angular/common';

// declare var Razorpay: any;

// interface CreatePaymentResponse {
//   success: boolean;
//   keyId: string;

//   order: {
//     id: string;
//     amount: number;
//     currency: string;
//   };
// }

// interface VerifyPaymentResponse {
//   success: boolean;
//   message: string;

//   order?: {
//     id: string;
//     razorpay_order_id: string;
//     razorpay_payment_id: string;
//     payment_status: string;
//     order_status: string;
//   };
// }

// @Component({
//   selector: 'app-payment',
//   standalone: true,
//    imports: [
//     DecimalPipe
//   ],
//   templateUrl: './payment.html',
//   styleUrl: './payment.scss'
// })
// export class Payment implements OnInit {

//   loading = false;

//   errorMessage = '';

//   total = 0;

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     public authService: AuthService
//   ) {}

//   ngOnInit(): void {

//     if (!this.authService.getToken()) {
//       this.router.navigate(['/signin']);
//       return;
//     }

//     this.loadCartTotal();
//   }

//   private loadCartTotal(): void {

//     /*
//      * Replace this with your actual CartService.
//      *
//      * For now we read the existing cart.
//      */

//     const cart =
//       localStorage.getItem('cart');

//     if (!cart) {
//       this.total = 0;
//       return;
//     }

//     try {

//       const items =
//         JSON.parse(cart);

//       this.total =
//         items.reduce(
//           (sum: number, item: any) =>
//             sum +
//             Number(item.price || 0) *
//             Number(item.quantity || 1),
//           0
//         );

//     } catch {

//       this.total = 0;

//     }
//   }

//   payNow(): void {

//     if (this.total <= 0) {
//       this.errorMessage =
//         'Your cart is empty.';

//       return;
//     }

//     this.loading = true;
//     this.errorMessage = '';

//     const token =
//       this.authService.getToken();

//     this.http.post<CreatePaymentResponse>(
//       '/api/create-payment-order',
//       {
//         amount: this.total
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     ).subscribe({

//       next: response => {

//         if (!response.success) {

//           this.loading = false;

//           this.errorMessage =
//             'Unable to start payment.';

//           return;
//         }

//         this.openRazorpay(response);

//       },

//       error: error => {

//         this.loading = false;

//         console.error(
//           'Create payment error:',
//           error
//         );

//         this.errorMessage =
//           error?.error?.message ||
//           'Unable to start payment.';
//       }

//     });
//   }

//   private openRazorpay(
//     response: CreatePaymentResponse
//   ): void {

//     const options = {

//       key: response.keyId,

//       amount: response.order.amount,

//       currency: response.order.currency,

//       name: 'BookVerse',

//       description: 'Book purchase',

//       order_id: response.order.id,

//       prefill: {
//         name:
//           this.authService.getUser()?.name || '',

//         email:
//           this.authService.getUser()?.email || '',

//         contact:
//           this.authService.getUser()?.mobileNumber || ''
//       },

//       theme: {
//         color: '#6c4cff'
//       },

//       handler: (paymentResponse: any) => {

//         this.verifyPayment(
//           paymentResponse
//         );

//       },

//       modal: {
//         ondismiss: () => {

//           this.loading = false;

//         }
//       }

//     };

//     const razorpay =
//       new Razorpay(options);

//     razorpay.open();
//   }

//   private verifyPayment(
//     paymentResponse: any
//   ): void {

//     const token =
//       this.authService.getToken();

//     this.http.post<VerifyPaymentResponse>(
//       '/api/verify-payment',
//       {
//         razorpayOrderId:
//           paymentResponse.razorpay_order_id,

//         razorpayPaymentId:
//           paymentResponse.razorpay_payment_id,

//         razorpaySignature:
//           paymentResponse.razorpay_signature
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     ).subscribe({

//       next: response => {

//         this.loading = false;

//         if (!response.success) {

//           this.errorMessage =
//             'Payment verification failed.';

//           return;
//         }

//         /*
//          * Payment is verified.
//          */

//         localStorage.removeItem('cart');

//         this.router.navigate(
//           ['/order-success'],
//           {
//             state: {
//               order: response.order
//             }
//           }
//         );

//       },

//       error: error => {

//         this.loading = false;

//         console.error(
//           'Payment verification error:',
//           error
//         );

//         this.errorMessage =
//           error?.error?.message ||
//           'Payment verification failed.';
//       }

//     });
//   }
// }

// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { PaymentService } from '../../services/payment';
// import { DecimalPipe } from '@angular/common';

// declare const Razorpay: any;

// @Component({
//   selector: 'app-payment',
//   standalone: true,
//    imports: [
//   DecimalPipe
//  ],
//   templateUrl: './payment.html',
//   styleUrl: './payment.scss'
// })
// export class Payment {

//   loading = false;

//   errorMessage = '';

//   totalAmount = 0;

//   constructor(
//     private paymentService: PaymentService,
//     private router: Router
//   ) {

//     const cart =
//       JSON.parse(
//         localStorage.getItem('cart') || '[]'
//       );

//     this.totalAmount = cart.reduce(
//       (total: number, item: any) =>
//         total + Number(item.price || 0) *
//         Number(item.quantity || 1),
//       0
//     );
//   }

//   payNow(): void {

//     this.errorMessage = '';

//     if (this.totalAmount <= 0) {
//       this.errorMessage =
//         'Your cart is empty.';

//       return;
//     }

//     this.loading = true;

//     this.paymentService
//       .createOrder(this.totalAmount)
//       .subscribe({

//         next: response => {

//           if (!response.success) {
//             this.loading = false;

//             this.errorMessage =
//               response.message ||
//               'Unable to create payment order.';

//             return;
//           }

//           this.openRazorpay(response);
//         },

//         error: error => {

//           console.error(
//             'Create payment order error:',
//             error
//           );

//           this.loading = false;

//           this.errorMessage =
//             error?.error?.message ||
//             'Unable to start payment.';
//         }

//       });
//   }

//   private openRazorpay(
//     response: any
//   ): void {

//     const options = {

//       key: response.keyId,

//       amount: response.amount,

//       currency: response.currency,

//       name: 'BookVerse',

//       description:
//         'BookVerse Book Purchase',

//       order_id:
//         response.orderId,

//       theme: {
//         color: '#6c4ab6'
//       },

//       handler: (paymentResponse: any) => {

//         this.verifyPayment(
//           paymentResponse
//         );
//       },

//       modal: {
//         ondismiss: () => {
//           this.loading = false;
//         }
//       }
//     };

//     const razorpay =
//       new Razorpay(options);

//     razorpay.on(
//       'payment.failed',
//       (error: any) => {

//         console.error(
//           'Razorpay payment failed:',
//           error
//         );

//         this.loading = false;

//         this.errorMessage =
//           'Payment failed. Please try again.';
//       }
//     );

//     razorpay.open();
//   }

//   private verifyPayment(
//     paymentResponse: any
//   ): void {

//     this.paymentService
//       .verifyPayment({
//         razorpay_payment_id:
//           paymentResponse.razorpay_payment_id,

//         razorpay_order_id:
//           paymentResponse.razorpay_order_id,

//         razorpay_signature:
//           paymentResponse.razorpay_signature
//       })
//       .subscribe({

//         next: response => {

//           this.loading = false;

//           if (!response.success) {

//             this.errorMessage =
//               response.message ||
//               'Payment verification failed.';

//             return;
//           }

//           // Payment is verified by server.
//           this.router.navigate(
//             ['/order-success'],
//             {
//               queryParams: {
//                 orderId:
//                   response.orderId
//               }
//             }
//           );
//         },

//         error: error => {

//           console.error(
//             'Payment verification error:',
//             error
//           );

//           this.loading = false;

//           this.errorMessage =
//             'Unable to verify payment.';
//         }
//       });
//   }
// }

//import { Component } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import { PaymentService } from '../../services/payment';
import { CartService } from '../../services/cart';

declare const Razorpay: any;

@Component({
  selector: 'app-payment',
  standalone: true,

  imports: [
    DecimalPipe
  ],

  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})

export class Payment implements OnInit, OnDestroy {

  loading = false;

  errorMessage = '';
  networkStatus = 'Checking connection...';
networkType = 'Unknown';
networkSpeed = 'Unknown';
networkRtt = 'Unknown';
saveData = false;
isOnline = true;
networkSlow = false;

private connection: any = null;

private readonly updateConnectionHandler = () => {
  this.checkInternetConnection();
};

private readonly onlineHandler = () => {
  this.checkInternetConnection();
};

private readonly offlineHandler = () => {
  this.checkInternetConnection();
};

  // -----------------------------
  // AMOUNTS
  // -----------------------------

  subtotal = 0;

  deliveryCharge = 0;

  handlingCharge = 0;

  convenienceCharge = 0;

  packagingCharge = 0;

  sgst = 0;

  cgst = 0;

  totalAmount = 0;

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private router: Router
  ) {
    this.loadPaymentTotals();
  }

  // ----------------------------------
// LIFECYCLE
// ----------------------------------

ngOnInit(): void {
  this.checkInternetConnection();
}

ngOnDestroy(): void {
  window.removeEventListener('online', this.onlineHandler);
  window.removeEventListener('offline', this.offlineHandler);

  this.connection?.removeEventListener?.(
    'change',
    this.updateConnectionHandler
  );
}

  private loadPaymentTotals(): void {

    this.subtotal =
      Number(this.cartService.subtotal() || 0);

    this.deliveryCharge =
      Number(this.cartService.deliveryCharge() || 0);

    this.handlingCharge =
      Number(this.cartService.handlingCharge() || 0);

    this.convenienceCharge =
      Number(this.cartService.convenienceCharge() || 0);

    this.packagingCharge =
      Number(this.cartService.packagingCharge() || 0);

    this.sgst =
      Number(this.cartService.sgstCharge() || 0);

    this.cgst =
      Number(this.cartService.cgstCharge() || 0);

    this.totalAmount =
      Number(this.cartService.total().toFixed(2));

    console.log('Payment totals:', {
      subtotal: this.subtotal,
      deliveryCharge: this.deliveryCharge,
      handlingCharge: this.handlingCharge,
      convenienceCharge: this.convenienceCharge,
      packagingCharge: this.packagingCharge,
      sgst: this.sgst,
      cgst: this.cgst,
      totalAmount: this.totalAmount
    });
  }

// ----------------------------------
// CHECK INTERNET CONNECTION
// ----------------------------------

private checkInternetConnection(): void {

  this.isOnline = navigator.onLine;

  if (!this.isOnline) {

    this.networkStatus = 'No Internet Connection';
    this.networkType = 'Offline';
    this.networkSpeed = '0 Mbps';
    this.networkRtt = '--';
    this.saveData = false;
    this.networkSlow = true;

    return;
  }

  this.connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!this.connection) {

    this.networkStatus = 'Internet Connected';
    this.networkType = 'Unknown';
    this.networkSpeed = 'Not Supported';
    this.networkRtt = 'Not Supported';
    this.saveData = false;
    this.networkSlow = false;

    return;
  }

  const effectiveType =
    this.connection.effectiveType || 'unknown';

  const downlink =
    this.connection.downlink;

  const rtt =
    this.connection.rtt;

  this.saveData =
    !!this.connection.saveData;

  switch (effectiveType) {

    case 'slow-2g':
      this.networkType = 'Slow 2G';
      break;

    case '2g':
      this.networkType = '2G';
      break;

    case '3g':
      this.networkType = '3G';
      break;

    case '4g':
      this.networkType = '4G';
      break;

    case '5g':
      this.networkType = '5G';
      break;

    default:
      this.networkType =
        effectiveType.toUpperCase();
  }

  this.networkSpeed =
    downlink
      ? `${downlink.toFixed(1)} Mbps`
      : 'Unknown';

  this.networkRtt =
    rtt
      ? `${rtt} ms`
      : 'Unknown';

  this.networkSlow =
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    effectiveType === '3g' ||
    (downlink && downlink < 1.5) ||
    (rtt && rtt > 300);

  this.networkStatus =
    this.networkSlow
      ? 'Slow Internet'
      : 'Good Internet';

  window.removeEventListener(
    'online',
    this.onlineHandler
  );

  window.removeEventListener(
    'offline',
    this.offlineHandler
  );

  window.addEventListener(
    'online',
    this.onlineHandler
  );

  window.addEventListener(
    'offline',
    this.offlineHandler
  );

  this.connection.removeEventListener?.(
    'change',
    this.updateConnectionHandler
  );

  this.connection.addEventListener?.(
    'change',
    this.updateConnectionHandler
  );
}

  // -----------------------------
  // CALCULATE PAYMENT TOTAL
  // -----------------------------

  private calculateTotal(): void {

    // Cart total = subtotal
    this.subtotal =
      Number(this.cartService.getTotal() || 0);


    // Charges
    this.deliveryCharge =
      this.subtotal * 0.02;

    this.handlingCharge =
      this.subtotal * 0.01;

    this.convenienceCharge =
      this.subtotal * 0.01;

    this.packagingCharge =
      this.subtotal * 0.01;

    this.sgst =
      this.subtotal * 0.025;

    this.cgst =
      this.subtotal * 0.025;


    // Final total
    this.totalAmount =
      this.subtotal +
      this.deliveryCharge +
      this.handlingCharge +
      this.convenienceCharge +
      this.packagingCharge +
      this.sgst +
      this.cgst;


    // Keep money calculation to 2 decimal places
    this.totalAmount =
      Number(this.totalAmount.toFixed(2));


    // console.log('Payment calculation:', {

    //   subtotal: this.subtotal,

    //   delivery: this.deliveryCharge,

    //   handling: this.handlingCharge,

    //   convenience: this.convenienceCharge,

    //   packaging: this.packagingCharge,

    //   sgst: this.sgst,

    //   cgst: this.cgst,

    //   total: this.totalAmount

    // });

  }



  payNow(): void {

    this.errorMessage = '';

    if (this.totalAmount <= 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }

    const addressId =
      localStorage.getItem('bookverse_address_id');

    if (!addressId) {

      this.errorMessage =
        'Please add your delivery address before payment.';

      this.router.navigate(['/checkout']);

      return;
    }

    this.loading = true;

    // console.log(
    //   'Subtotal:',
    //   this.subtotal
    // );

    // console.log(
    //   'Delivery:',
    //   this.deliveryCharge
    // );

    // console.log(
    //   'Handling:',
    //   this.handlingCharge
    // );

    // console.log(
    //   'Convenience:',
    //   this.convenienceCharge
    // );

    // console.log(
    //   'Packaging:',
    //   this.packagingCharge
    // );

    // console.log(
    //   'SGST:',
    //   this.sgst
    // );

    // console.log(
    //   'CGST:',
    //   this.cgst
    // );

    // console.log(
    //   'Final payment amount:',
    //   this.totalAmount
    // );

    // console.log(
    //   'Address ID:',
    //   addressId
    // );

    //console.log('Payment amount:', this.totalAmount);
    //console.log('Address ID:', addressId);

    const items = this.cartService.getCartItems().map(item => ({
      book_id: item.id,
      title: item.title,
      author: item.author || null,
      image_url: item.image || null,
      quantity: item.quantity,
      unit_price: Number(item.price),
      total_price: Number(item.price) * item.quantity
    }));

    this.paymentService
      .createOrder(
        this.subtotal,
        this.deliveryCharge,
        this.handlingCharge,
        this.convenienceCharge,
        this.packagingCharge,
        this.sgst,
        this.cgst,
        this.totalAmount,
        addressId,
        items
      )
      .subscribe({

        next: response => {

          // console.log(
          //   'Create payment order response:',
          //   response
          // );

          if (!response.success) {

            this.loading = false;

            this.errorMessage =
              response.message ||
              'Unable to create payment order.';

            return;
          }

          this.openRazorpay(response);
        },

        error: error => {

          console.error(
            'Create payment order error:',
            error
          );

          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to start payment.';
        }

      });
  }

  private openRazorpay(
    response: any
  ): void {

    const options = {

      key: response.keyId,

      amount: response.amount,

      currency: response.currency,

      name: 'BookVerse',

      description:
        'BookVerse Book Purchase',

      order_id:
        response.orderId,

      theme: {
        color: '#6c4ab6'
      },

      handler: (paymentResponse: any) => {

        this.verifyPayment(
          paymentResponse
        );
      },

      modal: {
        ondismiss: () => {

          this.loading = false;

        }
      }
    };

    const razorpay =
      new Razorpay(options);

    razorpay.open();
  }

  private verifyPayment(
    paymentResponse: any
  ): void {

    this.paymentService
      .verifyPayment({

        razorpay_payment_id:
          paymentResponse.razorpay_payment_id,

        razorpay_order_id:
          paymentResponse.razorpay_order_id,

        razorpay_signature:
          paymentResponse.razorpay_signature

      })
      .subscribe({

        next: response => {

          this.loading = false;

          if (!response.success) {

            this.errorMessage =
              response.message ||
              'Payment verification failed.';

            return;
          }
          // --------------------------------
          // PAYMENT SUCCESSFULLY VERIFIED
          // --------------------------------

          console.log(
            'Payment verified successfully:',
            response
          );

          // -----------------------------
          // CLEAR CART
          // -----------------------------

          this.cartService.clearCart();



          // Clear cart after successful payment
          localStorage.removeItem(
            'bookverse_cart'
          );


          // Show success alert
          alert(
            '🎉 Payment Successful!\n\n' +
            'Your order has been placed successfully.'
          );

          // Redirect after alert is closed
          this.router.navigate(
            ['/order-success'],
            {
              queryParams: {
                orderId: response.orderId
              }
            }
          );

        },


        error: error => {

          console.error(
            'Payment verification error:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to verify payment.';
        }

      });
  }
}