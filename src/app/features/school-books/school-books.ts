import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

interface SchoolBook {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  className: string;
}

@Component({
  selector: 'app-school-books',
  standalone: true,
  templateUrl: './school-books.html',
  styleUrl: './school-books.scss'
})
export class SchoolBooks {

  private router = inject(Router);

  public cart = inject(CartService);

  books: SchoolBook[] = [
    {
      id: 'school-1',
      title: 'Mathematics',
      author: 'NCERT',
      price: 250,
      image: 'assets/books/math.jpg',
      className: 'Class 10'
    },
    {
      id: 'school-2',
      title: 'Science',
      author: 'NCERT',
      price: 280,
      image: 'assets/books/science.jpg',
      className: 'Class 10'
    },
    {
      id: 'school-3',
      title: 'English',
      author: 'NCERT',
      price: 220,
      image: 'assets/books/english.jpg',
      className: 'Class 9'
    }
  ];

  viewDetails(book: SchoolBook): void {
    this.router.navigate([
      '/book',
      book.id
    ]);
  }

  addToCart(book: SchoolBook): void {

    this.cart.addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image
    });
  }
}