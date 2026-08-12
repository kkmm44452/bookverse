// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormBuilder,
//   ReactiveFormsModule,
//   Validators
// } from '@angular/forms';
// import { Router } from '@angular/router';

// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule
//   ],
//   templateUrl: './signup.html',
//   styleUrl: './signup.scss'
// })
// export class SignupComponent {

//   loading = false;
//   errorMessage = '';
//   successMessage = '';

//   signupForm;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.signupForm = this.fb.group({
//       name: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(2)
//         ]
//       ],

//       email: [
//         '',
//         [
//           Validators.required,
//           Validators.email
//         ]
//       ],

//       mobileNumber: [
//         '',
//         [
//           Validators.pattern(/^[6-9]\d{9}$/)
//         ]
//       ],

//       password: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(8)
//         ]
//       ],

//       confirmPassword: [
//         '',
//         [
//           Validators.required
//         ]
//       ]
//     });
//   }

//   signup(): void {
//     this.errorMessage = '';
//     this.successMessage = '';

//     if (this.signupForm.invalid) {
//       this.signupForm.markAllAsTouched();
//       return;
//     }

//     const {
//       name,
//       email,
//       mobileNumber,
//       password,
//       confirmPassword
//     } = this.signupForm.getRawValue();

//     if (password !== confirmPassword) {
//       this.errorMessage = 'Passwords do not match.';
//       return;
//     }

//     this.loading = true;

//     this.authService.signup({
//       name: name!.trim(),
//       email: email!.trim(),
//       mobileNumber: mobileNumber?.trim() || undefined,
//       password: password!
//     }).subscribe({
//       next: (response) => {
//         this.loading = false;

//         if (!response.success) {
//           this.errorMessage =
//             response.message || 'Unable to create account.';
//           return;
//         }

//         this.successMessage =
//           'Account created successfully!';

//         setTimeout(() => {
//           this.router.navigate(['/']);
//         }, 800);
//       },

//       error: (error) => {
//         this.loading = false;

//         console.error('Signup error:', error);

//         this.errorMessage =
//           error?.error?.message ||
//           'Something went wrong while creating your account.';
//       }
//     });
//   }

//   get name() {
//     return this.signupForm.get('name');
//   }

//   get email() {
//     return this.signupForm.get('email');
//   }

//   get mobileNumber() {
//     return this.signupForm.get('mobileNumber');
//   }

//   get password() {
//     return this.signupForm.get('password');
//   }

//   get confirmPassword() {
//     return this.signupForm.get('confirmPassword');
//   }
// }

import { Component } from '@angular/core';
import {
AbstractControl,
FormBuilder,
FormGroup,
ReactiveFormsModule,
ValidationErrors,
Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';


@Component({
selector: 'app-signup',
standalone: true,
imports: [
ReactiveFormsModule,
RouterLink
],
templateUrl: './signup.html',
styleUrl: './signup.scss'
})
export class SignupComponent {

signupForm: FormGroup;

loading = false;
errorMessage = '';
successMessage = '';

constructor(
private fb: FormBuilder,
private authService: AuthService,
private router: Router
) {

this.signupForm = this.fb.group(
  {
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    mobileNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/)
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],

    confirmPassword: [
      '',
      [
        Validators.required
      ]
    ]
  },
  {
    validators: this.passwordMatchValidator
  }
);


}

/*

Password Match Validator
*/
passwordMatchValidator(
control: AbstractControl
): ValidationErrors | null {
const password = control.get('password')?.value;
const confirmPassword = control.get('confirmPassword');

if (!confirmPassword) {
  return null;
}

if (
  password &&
  confirmPassword.value &&
  password !== confirmPassword.value
) {
  confirmPassword.setErrors({
    ...confirmPassword.errors,
    passwordMismatch: true
  });

  return {
    passwordMismatch: true
  };
}

if (confirmPassword.errors?.['passwordMismatch']) {

  const errors = {
    ...confirmPassword.errors
  };

  delete errors['passwordMismatch'];

  confirmPassword.setErrors(
    Object.keys(errors).length > 0
      ? errors
      : null
  );
}

return null;


}

/*

Form Controls
*/
get name() {
return this.signupForm.controls['name'];
}

get email() {
return this.signupForm.controls['email'];
}

get mobileNumber() {
return this.signupForm.controls['mobileNumber'];
}

get password() {
return this.signupForm.controls['password'];
}

get confirmPassword() {
return this.signupForm.controls['confirmPassword'];
}

/*

Signup
*/
signup(): void {

  this.errorMessage = '';
  this.successMessage = '';

  if (this.signupForm.invalid) {
    this.signupForm.markAllAsTouched();

    this.errorMessage =
      'Please correct the errors in the form.';

    return;
  }

  this.loading = true;

  const userData = {
    name: this.name.value.trim(),
    email: this.email.value.trim(),
    mobileNumber: this.mobileNumber.value.trim(),
    password: this.password.value
  };

  this.authService.signup(userData).subscribe({

    next: (response) => {

      this.loading = false;

      if (!response.success) {
        this.errorMessage =
          response.message || 'Unable to create account.';

        return;
      }

      this.successMessage =
        'Account created successfully!';

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 300);
    },

    error: (error) => {

      this.loading = false;

      console.error('Signup error:', error);

      this.errorMessage =
        error?.error?.message ||
        'Something went wrong while creating your account.';
    }

  });
}


}