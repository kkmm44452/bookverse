import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = '/api/order/get';

  constructor(
    private http: HttpClient
  ) {}

  getOrder(orderId: string): Observable<any> {

    const token =
      localStorage.getItem('token');

    const headers =
      new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

    return this.http.get<any>(
      `${this.apiUrl}?orderId=${encodeURIComponent(orderId)}`,
      {
        headers
      }
    );

  }

}