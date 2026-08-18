import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { CartService } from '../../services/cart';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {

  addressForm: FormGroup;

  loading = false;

  cartItems: any[] = [];

  subtotal = 0;

  deliveryCharge = 0;

  handlingCharge = 0;

  convenienceCharge = 0;

  packagingCharge = 0;

  sgstCharge = 0;

  cgstCharge = 0;

  total = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    public cartService: CartService

  ) {

    this.addressForm = this.fb.group({

      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9][0-9]{9}$/)
        ]
      ],

      addressLine1: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],

      addressLine2: [
        ''
      ],

      city: [
        '',
        [
          Validators.required
        ]
      ],

      state: [
        '',
        [
          Validators.required
        ]
      ],

      pincode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[1-9][0-9]{5}$/)
        ]
      ]

    });

    this.loadCart();

  }


  // -----------------------------
  // Load cart
  // -----------------------------

  loadCart(): void {

    const storedCart =
      localStorage.getItem('bookverse_cart');

    if (!storedCart) {

      this.router.navigate(['/cart']);

      return;

    }

    try {

      this.cartItems =
        JSON.parse(storedCart);

      if (
        !Array.isArray(this.cartItems) ||
        this.cartItems.length === 0
      ) {

        this.router.navigate(['/cart']);

        return;

      }

      this.calculateTotal();

    } catch {

      this.router.navigate(['/cart']);

    }

  }


  // -----------------------------
  // Calculate total
  // -----------------------------

  // calculateTotal(): void {

  //   this.subtotal =
  //     this.cartItems.reduce(
  //       (total, item) =>
  //         total +
  //         Number(item.price) *
  //         Number(item.quantity),
  //       0
  //     );

  //   this.deliveryCharge =
  //     this.subtotal >= 499
  //       ? 0
  //       : 49;

  //   this.total =
  //     this.subtotal +
  //     this.deliveryCharge;

  // }


  // calculateTotal(): void {

  //   this.subtotal =
  //     this.cartItems.reduce(
  //       (total, item) =>
  //         total +
  //         Number(item.price) *
  //         Number(item.quantity),
  //       0
  //     );

  //   // Delivery charge = 2% of subtotal
  //   this.deliveryCharge =
  //     Math.round(this.subtotal * 0.02 * 100) / 100;

  //   // Final total
  //   this.total =
  //     Math.round(
  //       (this.subtotal + this.deliveryCharge) * 100
  //     ) / 100;
  // }

  calculateTotal(): void {

    this.subtotal =
      this.cartService.subtotal();

    this.deliveryCharge =
      this.cartService.deliveryCharge();

    this.handlingCharge =
      this.cartService.handlingCharge();

    this.convenienceCharge =
      this.cartService.convenienceCharge();

    this.packagingCharge =
      this.cartService.packagingCharge();

    this.sgstCharge =
      this.cartService.sgstCharge();

    this.cgstCharge =
      this.cartService.cgstCharge();

    this.total =
      this.cartService.total();

  }

  // -----------------------------
  // Form controls
  // -----------------------------

  get fullName() {
    return this.addressForm.controls['fullName'];
  }

  get mobileNumber() {
    return this.addressForm.controls['mobileNumber'];
  }

  get addressLine1() {
    return this.addressForm.controls['addressLine1'];
  }

  get city() {
    return this.addressForm.controls['city'];
  }

  get state() {
    return this.addressForm.controls['state'];
  }

  get pincode() {
    return this.addressForm.controls['pincode'];
  }


  // -----------------------------
  // Continue to payment
  // -----------------------------

  continueToPayment(): void {

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const token =
      localStorage.getItem('bookverse_token');

    if (!token) {
      this.loading = false;
      this.router.navigate(['/signin']);
      return;
    }

    const address = {
      fullName:
        this.addressForm.value.fullName.trim(),

      mobileNumber:
        this.addressForm.value.mobileNumber.trim(),

      addressLine1:
        this.addressForm.value.addressLine1.trim(),

      addressLine2:
        this.addressForm.value.addressLine2?.trim() || '',

      city:
        this.addressForm.value.city.trim(),

      state:
        this.addressForm.value.state.trim(),

      postalCode:
        this.addressForm.value.pincode.trim(),

      country: 'India',

      isDefault: false
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post<any>(
      '/api/address/create',
      address,
      { headers }
    ).subscribe({

      next: (response) => {

        this.loading = false;

        console.log(
          'Address API response:',
          response
        );

        if (
          !response.success ||
          !response.address?.id
        ) {
          console.error(
            'Invalid address response:',
            response
          );
          return;
        }

        const addressId =
          response.address.id;

        // Save address ID for payment
        localStorage.setItem(
          'bookverse_address_id',
          addressId
        );

        // Optional: keep address details for UI
        localStorage.setItem(
          'bookverse_checkout_address',
          JSON.stringify(address)
        );

        console.log(
          'Address ID:',
          addressId
        );

        // Go to payment
        this.router.navigate(['/payment']);

      },

      error: (error) => {

        this.loading = false;

        console.error(
          'Address creation error:',
          error
        );

        this.addressForm.setErrors({
          serverError: true
        });
      }

    });
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }

}