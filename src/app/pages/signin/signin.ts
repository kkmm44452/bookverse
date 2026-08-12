// import { Component } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators
// } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// interface SigninResponse {
//   success: boolean;
//   message: string;
//   token?: string;
//   user?: {
//     id: string;
//     email: string;
//     name: string;
//     mobileNumber?: string;
//   };
// }

// @Component({
//   selector: 'app-signin',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     RouterLink
//   ],
//   templateUrl: './signin.html',
//   styleUrl: './signin.scss'
// })
// export class SigninComponent {

//   signinForm: FormGroup;

//   loading = false;
//   errorMessage = '';
//   successMessage = '';

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router
//   ) {

//     this.signinForm = this.fb.group({
//       email: [
//         '',
//         [
//           Validators.required,
//           Validators.email
//         ]
//       ],

//       password: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(8)
//         ]
//       ]
//     });

//   }

//   // -----------------------------
//   // Form controls
//   // -----------------------------

//   get email() {
//     return this.signinForm.controls['email'];
//   }

//   get password() {
//     return this.signinForm.controls['password'];
//   }

//   // -----------------------------
//   // Sign in
//   // -----------------------------

//   signin(): void {

//     this.errorMessage = '';
//     this.successMessage = '';

//     if (this.signinForm.invalid) {
//       this.signinForm.markAllAsTouched();
//       return;
//     }

//     this.loading = true;

//     const signinData = {
//       email: this.email.value.trim().toLowerCase(),
//       password: this.password.value
//     };

//     this.http.post<SigninResponse>(
//       '/api/signin',
//       signinData
//     ).subscribe({

//       next: (response) => {

//         this.loading = false;

//         if (!response.success || !response.token) {
//           this.errorMessage =
//             response.message || 'Unable to sign in.';

//           return;
//         }

//         // Store JWT
//         localStorage.setItem(
//           'auth_token',
//           response.token
//         );

//         // Store user information
//         if (response.user) {
//           localStorage.setItem(
//             'auth_user',
//             JSON.stringify(response.user)
//           );
//         }

//         this.successMessage =
//           'Login successful!';

//         // Go to home
//         setTimeout(() => {
//           this.router.navigate(['/']);
//         }, 500);

//       },

//       error: (error) => {

//         this.loading = false;

//         console.error('Signin error:', error);

//         this.errorMessage =
//           error?.error?.message ||
//           'Invalid email or password.';
//       }

//     });
//   }
// }

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class SigninComponent {

  signinForm: FormGroup;

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.signinForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ]
    });
  }

  // -----------------------------
  // Form controls
  // -----------------------------

  get email() {
    return this.signinForm.controls['email'];
  }

  get password() {
    return this.signinForm.controls['password'];
  }

  // -----------------------------
  // Sign in
  // -----------------------------

  signin(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const signinData = {
      email: this.email.value.trim().toLowerCase(),
      password: this.password.value
    };

    this.authService.signin(signinData).subscribe({

      next: (response) => {

        this.loading = false;

        if (!response.success || !response.token || !response.user) {

          this.errorMessage =
            response.message || 'Unable to sign in.';

          return;
        }

        /*
         * AuthService has already stored:
         *
         * bookverse_token
         * bookverse_user
         *
         * and updated its signal.
         */

        this.successMessage = 'Login successful!';

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 500);
      },

      error: (error) => {

        this.loading = false;

        console.error('Signin error:', error);

        this.errorMessage =
          error?.error?.message ||
          'Invalid email or password.';
      }

    });
  }
}