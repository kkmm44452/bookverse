import {
  Injectable,
  signal,
  computed
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  tap
} from 'rxjs';


export interface AuthUser {
  id: string;
  email: string;
  name: string;
  mobileNumber?: string | null;
}


export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}


export interface SignupRequest {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
}


export interface SigninRequest {
  email: string;
  password: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'bookverse_token';
  private readonly USER_KEY = 'bookverse_user';


  // --------------------------------
  // USER SIGNAL
  // --------------------------------

  private readonly userSignal =
    signal<AuthUser | null>(
      this.getStoredUser()
    );


  // Public readonly user signal
  readonly user =
    this.userSignal.asReadonly();


  // --------------------------------
  // LOGIN STATE
  // --------------------------------

  readonly isLoggedIn = computed(() => {

    return this.userSignal() !== null;

  });


  constructor(
    private http: HttpClient
  ) {}


  // =================================
  // SIGN UP
  // =================================

  signup(
    data: SignupRequest
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        '/api/signup',
        data
      )
      .pipe(

        tap(response => {

          if (
            response.success &&
            response.token &&
            response.user
          ) {

            this.setAuth(
              response.token,
              response.user
            );

          }

        })

      );

  }


  // =================================
  // SIGN IN
  // =================================

  signin(
    data: SigninRequest
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        '/api/signin',
        data
      )
      .pipe(

        tap(response => {

          if (
            response.success &&
            response.token &&
            response.user
          ) {

            this.setAuth(
              response.token,
              response.user
            );

          }

        })

      );

  }


  // =================================
  // SAVE AUTHENTICATION
  // =================================

  private setAuth(
    token: string,
    user: AuthUser
  ): void {

    // Save token
    localStorage.setItem(
      this.TOKEN_KEY,
      token
    );


    // Save user
    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify(user)
    );


    // IMPORTANT:
    // Update Angular signal
    this.userSignal.set(user);

  }


  // =================================
  // GET STORED USER
  // =================================

  private getStoredUser(): AuthUser | null {

    const storedUser =
      localStorage.getItem(
        this.USER_KEY
      );


    if (!storedUser) {
      return null;
    }


    try {

      return JSON.parse(
        storedUser
      ) as AuthUser;

    } catch {

      localStorage.removeItem(
        this.USER_KEY
      );

      return null;

    }

  }


  // =================================
  // LOGOUT
  // =================================

  logout(): void {

    localStorage.removeItem(
      this.TOKEN_KEY
    );

    localStorage.removeItem(
      this.USER_KEY
    );


    // IMPORTANT:
    // This immediately triggers
    // Angular change detection
    this.userSignal.set(null);

  }


  // =================================
  // GET TOKEN
  // =================================

  getToken(): string | null {

    return localStorage.getItem(
      this.TOKEN_KEY
    );

  }


  // =================================
  // GET USER
  // =================================

  getUser(): AuthUser | null {

    return this.userSignal();

  }

}