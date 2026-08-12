// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface CreatePaymentOrderResponse {
//   success: boolean;
//   keyId: string;
//   orderId: string;
//   amount: number;
//   currency: string;
//   message?: string;
// }

// export interface VerifyPaymentResponse {
//   success: boolean;
//   message: string;
//   orderId?: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class PaymentService {

//   constructor(
//     private http: HttpClient
//   ) {}

//   private getHeaders(): HttpHeaders {

//     const token =
//       localStorage.getItem('bookverse_token');

//     return new HttpHeaders({
//       Authorization: `Bearer ${token}`
//     });
//   }

//   createOrder(
//     amount: number,
//     addressId?: string
//   ): Observable<CreatePaymentOrderResponse> {

//     return this.http.post<CreatePaymentOrderResponse>(
//       '/api/payment/create-order',
//       {
//         amount,
//         currency: 'INR',
//         addressId
//       },
//       {
//         headers: this.getHeaders()
//       }
//     );
//   }

//   verifyPayment(
//     payment: {
//       razorpay_payment_id: string;
//       razorpay_order_id: string;
//       razorpay_signature: string;
//     }
//   ): Observable<VerifyPaymentResponse> {

//     return this.http.post<VerifyPaymentResponse>(
//       '/api/payment/verify',
//       payment,
//       {
//         headers: this.getHeaders()
//       }
//     );
//   }
// }

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';


// ----------------------------------
// Create Payment Order Response
// ----------------------------------

export interface CreatePaymentOrderResponse {

  success: boolean;

  message?: string;

  keyId: string;

  orderId: string;

  amount: number;

  currency: string;

  databaseOrderId?: string;

  orderNumber?: string;

  addressId?: string;
}


// ----------------------------------
// Verify Payment Response
// ----------------------------------

export interface VerifyPaymentResponse {

  success: boolean;

  message: string;

  orderId?: string;

}


// ----------------------------------
// Payment Service
// ----------------------------------

@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  constructor(
    private http: HttpClient
  ) {}


  // ----------------------------------
  // Authorization headers
  // ----------------------------------

  private getHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('bookverse_token');

    return new HttpHeaders({

      Authorization:
        `Bearer ${token}`

    });

  }


  // ----------------------------------
  // Create Razorpay Order
  // ----------------------------------

  createOrder(
    amount: number,
    addressId: string
  ): Observable<CreatePaymentOrderResponse> {

    return this.http.post<CreatePaymentOrderResponse>(

      '/api/payment/create-order',

      {
        amount,

        currency: 'INR',

        addressId
      },

      {
        headers: this.getHeaders()
      }

    );

  }


  // ----------------------------------
  // Verify Razorpay Payment
  // ----------------------------------

  verifyPayment(
    payment: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }
  ): Observable<VerifyPaymentResponse> {

    return this.http.post<VerifyPaymentResponse>(

      '/api/payment/verify',

      payment,

      {
        headers: this.getHeaders()
      }

    );

  }

}